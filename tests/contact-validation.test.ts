import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateContact } from '../src/lib/contact-validation';
test('contact accepts formatted local/international numbers and rejects malformed input', () => {
  for (const phone of ['050-123-4567', '+972 (50) 123-4567', '097654321']) assert.equal(validateContact('בדיקת QA', phone), null);
  for (const phone of ['', '123', 'abcdefghi', '+972+501234567', '050 123 4567 extension', '1234567890123456']) assert.equal(validateContact('בדיקה', phone)?.field, 'phone');
  for (const name of ['', '  ', 'א']) assert.equal(validateContact(name, '0501234567')?.field, 'name');
});
