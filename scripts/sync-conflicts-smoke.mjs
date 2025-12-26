#!/usr/bin/env node
import fs from 'node:fs';

const args = process.argv.slice(2);

const getArg = (name) => {
  const prefix = `--${name}=`;
  const match = args.find((arg) => arg.startsWith(prefix));
  if (match) return match.slice(prefix.length);
  const index = args.findIndex((arg) => arg === `--${name}`);
  if (index !== -1 && args[index + 1]) return args[index + 1];
  return null;
};

const apiBase = getArg('api')
  || process.env.API_BASE_URL
  || process.env.VITE_API_URL
  || 'http://localhost:3001/api';

const token = getArg('token') || process.env.API_TOKEN || process.env.LOTUS_TOKEN;
const lastSyncRaw = getArg('lastSyncAt') || getArg('lastSync') || '0';
const lastSyncAt = Number(lastSyncRaw);
const format = (getArg('format') || 'table').toLowerCase();
const verbose = args.includes('--verbose');

const formatTimestamp = (value) => {
  if (typeof value !== 'number' || !Number.isFinite(value)) return '-';
  return new Date(value).toISOString();
};

if (!Number.isFinite(lastSyncAt)) {
  console.error(`Invalid lastSyncAt value: ${lastSyncRaw}`);
  process.exit(1);
}

if (!token) {
  console.error('Missing token. Provide --token <jwt> or set API_TOKEN/LOTUS_TOKEN.');
  process.exit(1);
}

let localData = {};
const localInline = getArg('local');
const localFile = getArg('file');

if (localInline && localFile) {
  console.error('Use only one of --local or --file.');
  process.exit(1);
}

if (localInline) {
  try {
    localData = JSON.parse(localInline);
  } catch (error) {
    console.error('Failed to parse --local JSON:', error?.message || error);
    process.exit(1);
  }
} else if (localFile) {
  try {
    const raw = fs.readFileSync(localFile, 'utf8');
    localData = JSON.parse(raw);
  } catch (error) {
    console.error(`Failed to read/parse file ${localFile}:`, error?.message || error);
    process.exit(1);
  }
}

const response = await fetch(`${apiBase}/sync`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({ lastSyncAt, localData }),
});

const payload = await response.json().catch(() => null);

if (!response.ok) {
  console.error(`Sync failed with ${response.status}`);
  console.error(JSON.stringify(payload, null, 2));
  process.exit(1);
}

const conflicts = payload?.conflicts || [];
if (conflicts.length === 0) {
  if (format === 'json') {
    console.log(JSON.stringify([], null, 2));
  } else {
    const syncedAt = payload?.syncedAt ? formatTimestamp(payload.syncedAt) : null;
    console.log(`No conflicts${syncedAt ? ` (syncedAt: ${syncedAt})` : ''}.`);
  }
} else {
  if (format === 'json') {
    console.log(JSON.stringify(conflicts, null, 2));
  } else if (format === 'pretty') {
    const syncedAt = payload?.syncedAt ? formatTimestamp(payload.syncedAt) : null;
    console.log(`Conflicts (${conflicts.length})${syncedAt ? ` - syncedAt: ${syncedAt}` : ''}`);
    conflicts.forEach((conflict) => {
      console.log(
        `- ${conflict.field} (${conflict.resolution}) localUpdatedAt=${formatTimestamp(conflict.localUpdatedAt)} ` +
        `serverUpdatedAt=${formatTimestamp(conflict.serverUpdatedAt)}`
      );
      if (verbose) {
        console.log(`  localValue: ${JSON.stringify(conflict.localValue)}`);
        console.log(`  serverValue: ${JSON.stringify(conflict.serverValue)}`);
      }
    });
  } else {
    const rows = conflicts.map((conflict) => ({
      field: conflict.field,
      resolution: conflict.resolution,
      localUpdatedAt: formatTimestamp(conflict.localUpdatedAt),
      serverUpdatedAt: formatTimestamp(conflict.serverUpdatedAt),
    }));
    console.table(rows);
    if (verbose) {
      console.log(JSON.stringify(conflicts, null, 2));
    }
  }
}
