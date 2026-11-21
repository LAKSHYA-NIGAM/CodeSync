/**
 * CodeSync Room Access Control & Role-Based Permissions
 * Supports secure room passkey hashing (PBKDF2/SHA256) and role capabilities (viewer, editor, admin).
 */

import crypto from 'node:crypto';

export const PERMISSIONS = {
  ADMIN: ['read', 'write', 'delete_room', 'kick_user', 'change_role', 'lock_editor'],
  EDITOR: ['read', 'write'],
  VIEWER: ['read'],
};

export function hashRoomPasskey(passkey, salt = null) {
  if (typeof passkey !== 'string' || passkey.trim().length === 0) {
    return null;
  }
  const effectiveSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(passkey, effectiveSalt, 1000, 32, 'sha256').toString('hex');
  return { hash, salt: effectiveSalt };
}

export function verifyRoomPasskey(inputPasskey, storedHash, storedSalt) {
  if (!inputPasskey || !storedHash || !storedSalt) return false;
  const computed = hashRoomPasskey(inputPasskey, storedSalt);
  if (!computed) return false;
  return crypto.timingSafeEqual(Buffer.from(computed.hash), Buffer.from(storedHash));
}

export function canUserPerformAction(role, action) {
  const normalizedRole = (role || 'viewer').toUpperCase();
  const allowed = PERMISSIONS[normalizedRole] || PERMISSIONS.VIEWER;
  return allowed.includes(action);
}
