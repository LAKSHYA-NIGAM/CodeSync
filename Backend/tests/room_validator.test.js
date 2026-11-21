const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { validateCreateRoom, validateRoomId, SUPPORTED_LANGUAGES } = require('../Src/validators/room.validator');

describe('CodeSync Room Validator Tests', () => {
  test('validates valid room payload', () => {
    const result = validateCreateRoom({ roomName: 'Algorithm Study Room', language: 'python' });
    assert.equal(result.isValid, true);
    assert.equal(result.sanitized.roomName, 'Algorithm Study Room');
    assert.equal(result.sanitized.language, 'python');
    assert.equal(Object.keys(result.errors).length, 0);
  });

  test('rejects short room name and unsupported language', () => {
    const result = validateCreateRoom({ roomName: 'AB', language: 'pascal' });
    assert.equal(result.isValid, false);
    assert.ok(result.errors.roomName);
    assert.ok(result.errors.language);
  });

  test('sanitizes and trims whitespace from inputs', () => {
    const result = validateCreateRoom({ roomName: '   Web Dev Group   ', language: '  JAVASCRIPT  ' });
    assert.equal(result.isValid, true);
    assert.equal(result.sanitized.roomName, 'Web Dev Group');
    assert.equal(result.sanitized.language, 'javascript');
  });

  test('validates roomId format', () => {
    assert.equal(validateRoomId('a1b2c3d4-e5f6-7890'), true);
    assert.equal(validateRoomId('room123'), true);
    assert.equal(validateRoomId(''), false);
    assert.equal(validateRoomId('bad room with spaces'), false);
    assert.equal(validateRoomId(null), false);
  });
});
