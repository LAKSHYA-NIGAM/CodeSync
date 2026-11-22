/**
 * Operational Transformation (OT) Engine for Collaborative Text Editing
 * Supports character insert/delete operations, position shifting, and concurrent transforms.
 */

export class TextOperation {
  constructor(type, position, text = '') {
    this.type = type; // 'insert' | 'delete'
    this.position = Math.max(0, Number(position) || 0);
    this.text = typeof text === 'string' ? text : '';
  }

  apply(documentText) {
    const doc = typeof documentText === 'string' ? documentText : '';
    if (this.type === 'insert') {
      const pos = Math.min(this.position, doc.length);
      return doc.slice(0, pos) + this.text + doc.slice(pos);
    }
    if (this.type === 'delete') {
      const pos = Math.min(this.position, doc.length);
      const deleteLen = this.text.length;
      return doc.slice(0, pos) + doc.slice(pos + deleteLen);
    }
    return doc;
  }
}

/**
 * Transforms op1 against op2 so that applying op1' after op2 produces
 * the same document state as applying op2' after op1.
 */
export function transformOperations(op1, op2) {
  if (!(op1 instanceof TextOperation) || !(op2 instanceof TextOperation)) {
    return [op1, op2];
  }

  // 1. Both are inserts
  if (op1.type === 'insert' && op2.type === 'insert') {
    if (op1.position < op2.position) {
      return [op1, new TextOperation('insert', op2.position + op1.text.length, op2.text)];
    } else if (op1.position > op2.position) {
      return [new TextOperation('insert', op1.position + op2.text.length, op1.text), op2];
    } else {
      // Tie-break: prioritize op1
      return [op1, new TextOperation('insert', op2.position + op1.text.length, op2.text)];
    }
  }

  // 2. op1 insert, op2 delete
  if (op1.type === 'insert' && op2.type === 'delete') {
    if (op1.position <= op2.position) {
      return [op1, new TextOperation('delete', op2.position + op1.text.length, op2.text)];
    } else if (op1.position >= op2.position + op2.text.length) {
      return [new TextOperation('insert', op1.position - op2.text.length, op1.text), op2];
    } else {
      // Insert happened inside the deleted span
      return [op1, op2];
    }
  }

  // 3. op1 delete, op2 insert
  if (op1.type === 'delete' && op2.type === 'insert') {
    const [tOp2, tOp1] = transformOperations(op2, op1);
    return [tOp1, tOp2];
  }

  // 4. Both are deletes
  if (op1.type === 'delete' && op2.type === 'delete') {
    if (op1.position + op1.text.length <= op2.position) {
      return [op1, new TextOperation('delete', op2.position - op1.text.length, op2.text)];
    } else if (op2.position + op2.text.length <= op1.position) {
      return [new TextOperation('delete', op1.position - op2.text.length, op1.text), op2];
    }
  }

  return [op1, op2];
}
