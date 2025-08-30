const { fetchWithTimeout, jsonOrError } = require('../utils/http');
const { Breaker } = require('../utils/breaker');
const breaker = new Breaker();

async function lookupPDLByName(name) {
  if (!process.env.PDL_KEY) return { skipped: 'PDL_KEY missing' };
  if (!breaker.canTry()) return { skipped: 'pdl circuit open' };
  try {
    const url = `https://api.peopledatalabs.com/v5/person/enrich?name=${encodeURIComponent(name)}`;
    const res = await fetchWithTimeout(url, { headers: { 'X-Api-Key': process.env.PDL_KEY } });
    if (!res.ok) throw new Error(`pdl ${res.status}`);
    const data = await jsonOrError(res);
    breaker.recordSuccess();
    return { provider: 'pdl', data };
  } catch (e) {
    breaker.recordFailure();
    return { provider: 'pdl', error: e.message };
  }
}
module.exports = { lookupPDLByName };