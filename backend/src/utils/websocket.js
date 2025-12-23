import { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';

// ═══════════════════════════════════════════════════════════════════════════
// WEBSOCKET SERVER
// ═══════════════════════════════════════════════════════════════════════════

let wss = null;
const clients = new Map(); // userId -> Set of ws connections
const rooms = new Map(); // roomId -> Set of ws connections

export function initWebSocket(server) {
  wss = new WebSocketServer({ server, path: '/ws' });

  wss.on('connection', (ws, req) => {
    console.log('🔌 WebSocket connection established');

    // Parse token from query string
    const url = new URL(req.url, 'http://localhost');
    const token = url.searchParams.get('token');

    let userId = null;

    // Authenticate if token provided
    if (token) {
      try {
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
          throw new Error('JWT secret not configured');
        }
        const decoded = jwt.verify(token, jwtSecret);
        userId = decoded.userId || decoded.id;
        if (!userId) {
          throw new Error('Token missing userId');
        }
        addClient(userId, ws);
        ws.userId = userId;
        console.log(`   ✓ Authenticated user: ${userId}`);
      } catch (error) {
        console.log('   ⚠ Invalid token, continuing as anonymous');
      }
    }

    // Handle incoming messages
    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());
        handleMessage(ws, message);
      } catch (error) {
        ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
      }
    });

    // Handle disconnection
    ws.on('close', () => {
      if (userId) {
        removeClient(userId, ws);
      }
      removeFromAllRooms(ws);
      console.log('🔌 WebSocket connection closed');
    });

    // Handle errors
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });

    // Send welcome message
    ws.send(JSON.stringify({
      type: 'connected',
      timestamp: new Date().toISOString(),
      authenticated: !!userId,
    }));
  });

  console.log('✅ WebSocket server initialized');
  return wss;
}

// ═══════════════════════════════════════════════════════════════════════════
// CLIENT MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════

function addClient(userId, ws) {
  if (!clients.has(userId)) {
    clients.set(userId, new Set());
  }
  clients.get(userId).add(ws);
}

function removeClient(userId, ws) {
  const userClients = clients.get(userId);
  if (userClients) {
    userClients.delete(ws);
    if (userClients.size === 0) {
      clients.delete(userId);
    }
  }
}

function getClientConnections(userId) {
  return clients.get(userId) || new Set();
}

// ═══════════════════════════════════════════════════════════════════════════
// ROOM MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════

function joinRoom(roomId, ws) {
  if (!rooms.has(roomId)) {
    rooms.set(roomId, new Set());
  }
  rooms.get(roomId).add(ws);
  ws.rooms = ws.rooms || new Set();
  ws.rooms.add(roomId);
}

function leaveRoom(roomId, ws) {
  const room = rooms.get(roomId);
  if (room) {
    room.delete(ws);
    if (room.size === 0) {
      rooms.delete(roomId);
    }
  }
  if (ws.rooms) {
    ws.rooms.delete(roomId);
  }
}

function removeFromAllRooms(ws) {
  if (ws.rooms) {
    ws.rooms.forEach((roomId) => leaveRoom(roomId, ws));
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// MESSAGE HANDLING
// ═══════════════════════════════════════════════════════════════════════════

function handleMessage(ws, message) {
  const { type, payload } = message;

  switch (type) {
    case 'ping':
      ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
      break;

    case 'join_room':
      if (payload?.roomId) {
        joinRoom(payload.roomId, ws);
        ws.send(JSON.stringify({ type: 'joined_room', roomId: payload.roomId }));
      }
      break;

    case 'leave_room':
      if (payload?.roomId) {
        leaveRoom(payload.roomId, ws);
        ws.send(JSON.stringify({ type: 'left_room', roomId: payload.roomId }));
      }
      break;

    case 'subscribe':
      if (payload?.channel) {
        joinRoom(`channel:${payload.channel}`, ws);
        ws.send(JSON.stringify({ type: 'subscribed', channel: payload.channel }));
      }
      break;

    case 'unsubscribe':
      if (payload?.channel) {
        leaveRoom(`channel:${payload.channel}`, ws);
        ws.send(JSON.stringify({ type: 'unsubscribed', channel: payload.channel }));
      }
      break;

    default:
      ws.send(JSON.stringify({ type: 'error', message: `Unknown message type: ${type}` }));
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// BROADCASTING
// ═══════════════════════════════════════════════════════════════════════════

export function broadcast(type, payload, excludeWs = null) {
  if (!wss) return;

  const message = JSON.stringify({ type, payload, timestamp: Date.now() });

  wss.clients.forEach((client) => {
    if (client !== excludeWs && client.readyState === 1) {
      client.send(message);
    }
  });
}

export function broadcastToUser(userId, type, payload) {
  const userConnections = getClientConnections(userId);
  const message = JSON.stringify({ type, payload, timestamp: Date.now() });

  userConnections.forEach((ws) => {
    if (ws.readyState === 1) {
      ws.send(message);
    }
  });
}

export function broadcastToRoom(roomId, type, payload, excludeWs = null) {
  const room = rooms.get(roomId);
  if (!room) return;

  const message = JSON.stringify({ type, payload, timestamp: Date.now() });

  room.forEach((ws) => {
    if (ws !== excludeWs && ws.readyState === 1) {
      ws.send(message);
    }
  });
}

export function broadcastToChannel(channel, type, payload) {
  broadcastToRoom(`channel:${channel}`, type, payload);
}

// ═══════════════════════════════════════════════════════════════════════════
// SPECIFIC EVENTS
// ═══════════════════════════════════════════════════════════════════════════

export function notifyProgressUpdate(userId, progress) {
  broadcastToUser(userId, 'progress_update', progress);
}

export function notifyAchievementUnlocked(userId, achievement) {
  broadcastToUser(userId, 'achievement_unlocked', achievement);
}

export function notifySessionComplete(userId, session) {
  broadcastToUser(userId, 'session_complete', session);
}

export function notifyNewMessage(userId, message) {
  broadcastToUser(userId, 'new_message', message);
}

export function notifySyncRequired(userId) {
  broadcastToUser(userId, 'sync_required', { reason: 'data_updated' });
}

// ═══════════════════════════════════════════════════════════════════════════
// STATISTICS
// ═══════════════════════════════════════════════════════════════════════════

export function getStats() {
  return {
    totalConnections: wss ? wss.clients.size : 0,
    authenticatedUsers: clients.size,
    activeRooms: rooms.size,
  };
}

export default {
  initWebSocket,
  broadcast,
  broadcastToUser,
  broadcastToRoom,
  broadcastToChannel,
  notifyProgressUpdate,
  notifyAchievementUnlocked,
  notifySessionComplete,
  notifyNewMessage,
  notifySyncRequired,
  getStats,
};
