const { fetchWithTimeout, jsonOrError } = require('../utils/http');
const { Breaker } = require('../utils/breaker');
const breaker = new Breaker();

async function lookupClearbitByName(name) {
  if (!process.env.CLEARBIT_KEY) return { skipped: 'CLEARBIT_KEY missing' };
  if (!breaker.canTry()) return { skipped: 'clearbit circuit open' };
  try {
    const url = `https://person.clearbit.com/v2/combined/find?query=${encodeURIComponent(name)}`;
    const res = await fetchWithTimeout(url, { headers: { Authorization: `Bearer ${process.env.CLEARBIT_KEY}` } });
    if (!res.ok) throw new Error(`clearbit ${res.status}`);
    const data = await jsonOrError(res);
    breaker.recordSuccess();
    return { provider: 'clearbit', data };
  } catch (e) {
    breaker.recordFailure();
    return { provider: 'clearbit', error: e.message };
  }
}
module.exports = { lookupClearbitByName };