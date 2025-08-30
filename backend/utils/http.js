const defaultTimeout = parseInt(process.env.PROVIDER_TIMEOUT_MS || '1200', 10);

async function fetchWithTimeout(url, options = {}, timeoutMs = defaultTimeout) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: ctrl.signal });
    return res;
  } finally {
    clearTimeout(t);
  }
}

async function jsonOrError(res) {
  const text = await res.text();
  try { return JSON.parse(text); } catch { return { error: `Non-JSON from ${res.url}`, status: res.status, body: text } }
}

module.exports = { fetchWithTimeout, jsonOrError };