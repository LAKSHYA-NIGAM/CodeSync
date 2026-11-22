import assert from 'node:assert';
import test from 'node:test';
import { ReconnectSyncBuffer } from '../Src/utils/reconnectSyncBuffer.js';

test('ReconnectSyncBuffer: appending edits increments sequence', () => {
  const syncBuf = new ReconnectSyncBuffer(10);
  const e1 = syncBuf.appendEdit('u1', { type: 'insert', pos: 0, text: 'A' });
  const e2 = syncBuf.appendEdit('u2', { type: 'insert', pos: 1, text: 'B' });

  assert.strictEqual(e1.seq, 1);
  assert.strictEqual(e2.seq, 2);
  assert.strictEqual(syncBuf.currentSequence, 2);
});

test('ReconnectSyncBuffer: getEditsSince returns only newer edits', () => {
  const syncBuf = new ReconnectSyncBuffer(10);
  syncBuf.appendEdit('u1', { text: '1' });
  syncBuf.appendEdit('u1', { text: '2' });
  syncBuf.appendEdit('u1', { text: '3' });

  const res = syncBuf.getEditsSince(1);
  assert.strictEqual(res.requireFullSnapshot, false);
  assert.strictEqual(res.edits.length, 2);
  assert.strictEqual(res.edits[0].seq, 2);
  assert.strictEqual(res.edits[1].seq, 3);
});

test('ReconnectSyncBuffer: buffer overflow prompts full snapshot', () => {
  const syncBuf = new ReconnectSyncBuffer(2); // small buffer
  syncBuf.appendEdit('u1', { text: '1' });
  syncBuf.appendEdit('u1', { text: '2' });
  syncBuf.appendEdit('u1', { text: '3' }); // drops edit 1, buffer has [2, 3]

  const res = syncBuf.getEditsSince(0); // client asks for edits since 0
  assert.strictEqual(res.requireFullSnapshot, true);
  assert.deepStrictEqual(res.edits, []);
});
