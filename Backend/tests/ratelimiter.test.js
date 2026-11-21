const test = require('node:test');
const assert = require('node:assert/strict');

test('RateLimiter Algorithm: increments request count and enforces 5-request limit', async () => {
  // In-memory mock Redis for isolated unit testing
  class MockRedis {
    constructor() {
      this.store = new Map();
      this.expirations = new Map();
    }
    async incr(key) {
      const current = this.store.get(key) || 0;
      const next = current + 1;
      this.store.set(key, next);
      return next;
    }
    async expire(key, seconds) {
      this.expirations.set(key, seconds);
    }
  }

  const mockRedis = new MockRedis();
  const simulateRateLimit = async (ip) => {
    const key = `rate-limit:${ip}`;
    const request = await mockRedis.incr(key);
    if (request === 1) {
      await mockRedis.expire(key, 100);
    }
    if (request > 5) {
      return { status: 429, message: "Too many requests" };
    }
    return { status: 200, count: request };
  };

  const ip = '192.168.1.100';

  // First 5 requests should succeed
  for (let i = 1; i <= 5; i++) {
    const res = await simulateRateLimit(ip);
    assert.equal(res.status, 200);
    assert.equal(res.count, i);
  }

  // 6th request must trigger HTTP 429
  const limitedRes = await simulateRateLimit(ip);
  assert.equal(limitedRes.status, 429);
  assert.equal(limitedRes.message, 'Too many requests');

  // Verify another IP has independent quota
  const otherRes = await simulateRateLimit('192.168.1.101');
  assert.equal(otherRes.status, 200);
  assert.equal(otherRes.count, 1);
});
