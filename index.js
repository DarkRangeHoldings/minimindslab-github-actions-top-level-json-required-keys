import { appendFileSync } from 'node:fs';

try {
  const payloadRaw = process.env.INPUT_PAYLOAD;
  const outputPath = process.env.GITHUB_OUTPUT;

  const parsed = JSON.parse(payloadRaw);

  if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('Invalid payload');
  }

  const keys = Object.keys(parsed);
  if (keys.length !== 2 || !keys.includes('value') || !keys.includes('required')) {
    throw new Error('Invalid payload');
  }

  const value = parsed.value;
  const required = parsed.required;

  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('Invalid value');
  }

  if (!Array.isArray(required)) {
    throw new Error('Invalid required');
  }

  const seen = new Set();
  for (const k of required) {
    if (typeof k !== 'string' || k.length === 0 || seen.has(k)) {
      throw new Error('Invalid required');
    }
    seen.add(k);
  }

  const valueKeys = Object.keys(value);
  const present = [];
  const missing = [];

  for (const k of required) {
    if (valueKeys.includes(k)) present.push(k);
    else missing.push(k);
  }

  present.sort();
  missing.sort();

  const result = { missing, ok: missing.length === 0, present };
  appendFileSync(outputPath, `result=${JSON.stringify(result)}\n`);
} catch (err) {
  throw err;
}