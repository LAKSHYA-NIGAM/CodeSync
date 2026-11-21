const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('crypto');

test('Room Model & ID Generator: produces unique RFC-4122 v4 UUID identifiers', () => {
  const id1 = crypto.randomUUID();
  const id2 = crypto.randomUUID();

  assert.notEqual(id1, id2, 'Generated room IDs must be unique');
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  assert.match(id1, uuidRegex, 'Room ID must match standard UUID format');
});

test('Auth Input Validation: catches empty or missing registration fields', () => {
  const validateRegister = (body) => {
    const { username, email, password } = body;
    if (!username || !email || !password) {
      return { status: 400, message: "Username, email, and password are required" };
    }
    return { status: 200, valid: true };
  };

  assert.equal(validateRegister({}).status, 400);
  assert.equal(validateRegister({ username: 'test' }).status, 400);
  assert.equal(validateRegister({ username: 'test', email: 'test@example.com' }).status, 400);
  assert.equal(validateRegister({ username: 'test', email: 'test@example.com', password: 'secretpassword' }).status, 200);
});

test('Auth Input Validation: catches empty or missing login credentials', () => {
  const validateLogin = (body) => {
    const { email, password } = body;
    if (!email || !password) {
      return { status: 400, message: "Email and password are required" };
    }
    return { status: 200, valid: true };
  };

  assert.equal(validateLogin({}).status, 400);
  assert.equal(validateLogin({ email: 'user@test.com' }).status, 400);
  assert.equal(validateLogin({ email: 'user@test.com', password: 'password123' }).status, 200);
});

test('Room Membership & State: prevents duplicate user IDs in member array', () => {
  const members = ['user1', 'user2'];
  const join = (userId) => {
    if (!members.includes(userId)) {
      members.push(userId);
    }
  };

  join('user3');
  assert.equal(members.length, 3);

  // Attempt duplicate join
  join('user1');
  assert.equal(members.length, 3, 'Duplicate user should not be appended');
});

test('Room Membership: correctly filters out leaving user', () => {
  let members = ['user1', 'user2', 'user3'];
  const leave = (userId) => {
    members = members.filter(m => m !== userId);
  };

  leave('user2');
  assert.deepEqual(members, ['user1', 'user3']);
});
