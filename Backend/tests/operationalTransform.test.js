import assert from 'node:assert';
import test from 'node:test';
import { TextOperation, transformOperations } from '../Src/utils/operationalTransform.js';

test('TextOperation: applying insert and delete', () => {
  const initial = 'Hello World';
  const opInsert = new TextOperation('insert', 5, ' Beautiful');
  const inserted = opInsert.apply(initial);
  assert.strictEqual(inserted, 'Hello Beautiful World');

  const opDelete = new TextOperation('delete', 5, ' Beautiful');
  const deleted = opDelete.apply(inserted);
  assert.strictEqual(deleted, 'Hello World');
});

test('transformOperations: concurrent inserts at different positions', () => {
  const doc = 'ABC';
  // User 1 inserts 'X' at 0 -> 'XABC'
  // User 2 inserts 'Y' at 3 -> 'ABCY'
  const op1 = new TextOperation('insert', 0, 'X');
  const op2 = new TextOperation('insert', 3, 'Y');

  const [t1, t2] = transformOperations(op1, op2);

  // Applying op1 then t2
  const doc1 = t2.apply(op1.apply(doc));
  // Applying op2 then t1
  const doc2 = t1.apply(op2.apply(doc));

  assert.strictEqual(doc1, 'XABCY');
  assert.strictEqual(doc2, 'XABCY');
});

test('transformOperations: concurrent insert and delete', () => {
  const doc = 'Hello World';
  // User 1 deletes 'Hello ' at 0 -> 'World'
  // User 2 inserts 'Super ' at 6 -> 'Hello Super World'
  const opDel = new TextOperation('delete', 0, 'Hello ');
  const opIns = new TextOperation('insert', 6, 'Super ');

  const [tDel, tIns] = transformOperations(opDel, opIns);
  const docAfterDelThenIns = tIns.apply(opDel.apply(doc));
  assert.strictEqual(docAfterDelThenIns, 'Super World');
});
