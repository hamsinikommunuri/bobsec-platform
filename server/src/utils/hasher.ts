import crypto from 'crypto';

export function generateId(prefix = 'BS'): string {
  const random = crypto.randomBytes(4).toString('hex').toUpperCase();
  const timestamp = Date.now().toString().slice(-4);
  return `${prefix}-${timestamp}${random.slice(0, 4)}`;
}

export function generateHash(content: string): string {
  return '0x' + crypto.createHash('sha256').update(content, 'utf8').digest('hex').slice(0, 16);
}

export function generateReportIntegrityHash(data: unknown): string {
  const serialized = typeof data === 'string' ? data : JSON.stringify(data);
  return 'sha256:' + crypto.createHash('sha256').update(serialized, 'utf8').digest('hex');
}
