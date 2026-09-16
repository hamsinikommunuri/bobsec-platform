/**
 * Masking utilities for Personally Identifiable Information (PII)
 */

export function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 7) return phone;

  let subDigits = digits;
  let hasPrefix = false;
  if (digits.length === 12 && digits.startsWith('91')) {
    subDigits = digits.slice(2);
    hasPrefix = true;
  } else if (digits.length === 11 && digits.startsWith('0')) {
    subDigits = digits.slice(1);
  }

  const start = subDigits.slice(0, 2);
  const end = subDigits.slice(-2);
  const maskedMiddle = '******';

  if (phone.includes('+91') || hasPrefix) {
    return `+91 ${start}${maskedMiddle}${end}`;
  }
  return `${start}${maskedMiddle}${end}`;
}

export function maskEmail(email: string): string {
  const parts = email.split('@');
  if (parts.length !== 2) return email;
  const [local, domain] = parts;
  if (local.length <= 2) {
    return `${local[0] || '*'}*@${domain}`;
  }
  const start = local[0];
  const end = local[local.length - 1];
  return `${start}***${end}@${domain}`;
}

export function maskUPI(upi: string): string {
  const parts = upi.split('@');
  if (parts.length !== 2) return upi;
  const [handle, provider] = parts;
  // If handle looks like a phone number
  if (/^\d{10}$/.test(handle)) {
    return `${handle.slice(0, 2)}******${handle.slice(-2)}@${provider}`;
  }
  if (handle.length <= 3) {
    return `${handle[0]}*@${provider}`;
  }
  return `${handle.slice(0, 2)}***${handle.slice(-1)}@${provider}`;
}

export function maskTextPII(text: string): string {
  if (!text) return text;

  // Mask 10-digit Indian phone numbers with optional +91, spaces or dashes
  let result = text.replace(/(?:\+?91[\s-]?)?([6-9]\d{4}[\s-]?\d{5}|[6-9]\d{2}[\s-]?\d{3}[\s-]?\d{4}|[6-9]\d{9})\b/g, (match) => {
    return maskPhone(match);
  });

  // Mask Emails
  result = result.replace(/([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g, (match) => {
    return maskEmail(match);
  });

  // Mask UPI IDs
  result = result.replace(/([a-zA-Z0-9.\-_]{2,256})@([a-zA-Z]{2,64})\b/g, (match, handle, bank) => {
    // avoid email matches
    if (bank.includes('.')) return match;
    return maskUPI(match);
  });

  return result;
}

