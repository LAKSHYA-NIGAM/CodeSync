/**
 * CodeSync Reconnect Sync Buffer Manager
 * Manages monotonically increasing edit sequence numbers, buffers recent edits,
 * and replays missing edits to reconnected clients.
 */

export class ReconnectSyncBuffer {
  constructor(maxBufferSize = 100) {
    this.maxBufferSize = maxBufferSize;
    this.currentSequence = 0;
    this.buffer = []; // { seq, userId, operation, timestamp }
  }

  appendEdit(userId, operation) {
    this.currentSequence++;
    const entry = {
      seq: this.currentSequence,
      userId: userId || 'anonymous',
      operation,
      timestamp: Date.now(),
    };
    this.buffer.push(entry);

    if (this.buffer.length > this.maxBufferSize) {
      this.buffer.shift();
    }

    return entry;
  }

  getEditsSince(lastKnownSeq) {
    const seq = Number(lastKnownSeq) || 0;
    if (this.buffer.length > 0 && seq < this.buffer[0].seq - 1) {
      // The client is too far behind (buffer pruned) -> full snapshot required
      return { requireFullSnapshot: true, edits: [] };
    }

    const missingEdits = this.buffer.filter((item) => item.seq > seq);
    return {
      requireFullSnapshot: false,
      currentSequence: this.currentSequence,
      edits: missingEdits,
    };
  }

  clear() {
    this.buffer = [];
    this.currentSequence = 0;
  }
}
