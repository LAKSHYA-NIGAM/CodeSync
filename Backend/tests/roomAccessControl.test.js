import assert from 'node:assert';
import test from 'node:test';
import { hashRoomPasskey, verifyRoomPasskey, canUserPerformAction } from '../Src/utils/roomAccessControl.js';

test('roomAccessControl: passkey hashing and verification', () => {
  const secret = 'SyncRoom@2026';
  const creds = hashRoomPasskey(secret);
  assert.ok(creds.hash);
  assert.ok(creds.salt);

  const isValid = verifyRoomPasskey(secret, creds.hash, creds.salt);
  assert.strictEqual(isValid, true);

  const isInvalid = verifyRoomPasskey('WrongPassword', creds.hash, creds.salt);
  assert.strictEqual(isInvalid, false);
});

test('roomAccessControl: invalid or empty inputs', () => {
  assert.strictEqual(hashRoomPasskey(''), null);
  assert.strictEqual(hashRoomPasskey(null), null);
  assert.strictEqual(verifyRoomPasskey(null, 'abc', 'def'), false);
});

test('roomAccessControl: role permissions matrix', () => {
  // Admin permissions
  assert.strictEqual(canUserPerformAction('ADMIN', 'kick_user'), true);
  assert.strictEqual(canUserPerformAction('admin', 'delete_room'), true);
  assert.strictEqual(canUserPerformAction('ADMIN', 'write'), true);

  // Editor permissions
  assert.strictEqual(canUserPerformAction('EDITOR', 'write'), true);
  assert.strictEqual(canUserPerformAction('EDITOR', 'read'), true);
  assert.strictEqual(canUserPerformAction('EDITOR', 'kick_user'), false);

  // Viewer permissions
  assert.strictEqual(canUserPerformAction('VIEWER', 'read'), true);
  assert.strictEqual(canUserPerformAction('VIEWER', 'write'), false);
  assert.strictEqual(canUserPerformAction('UNKNOWN', 'write'), false);
});
