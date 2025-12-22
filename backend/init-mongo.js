// MongoDB initialization script for Docker
// This runs when the container starts for the first time

db = db.getSiblingDB('lotus_ait');

// Create application user
db.createUser({
  user: 'lotus',
  pwd: 'lotuspassword',
  roles: [
    {
      role: 'readWrite',
      db: 'lotus_ait',
    },
  ],
});

// Create indexes for better performance
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1 });
db.users.createIndex({ createdAt: -1 });

db.sessions.createIndex({ userId: 1, completedAt: -1 });
db.sessions.createIndex({ type: 1 });

db.clinicalprogresses.createIndex({ userId: 1 }, { unique: true });

db.gamifications.createIndex({ userId: 1 }, { unique: true });
db.gamifications.createIndex({ totalPoints: -1 });

db.settings.createIndex({ userId: 1 }, { unique: true });

db.audit_logs.createIndex({ userId: 1, timestamp: -1 });
db.audit_logs.createIndex({ action: 1, timestamp: -1 });
db.audit_logs.createIndex(
  { timestamp: 1 },
  { expireAfterSeconds: 90 * 24 * 60 * 60 }
); // 90 days TTL

print('✅ Database initialized with indexes');
