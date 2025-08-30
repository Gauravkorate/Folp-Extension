const { fetchWithTimeout, jsonOrError } = require('../utils/http');
const { Breaker } = require('../utils/breaker');
const breaker = new Breaker();

async function searchFacePP(imageUrlOrBase64) {
  if (!process.env.FACEPP_KEY || !process.env.FACEPP_SECRET) return { skipped: 'FACEPP creds missing' };
  if (!breaker.canTry()) return { skipped: 'face++ circuit open' };
  try {
    const url = 'https://api-us.faceplusplus.com/facepp/v3/detect';
    const form = new URLSearchParams({
      api_key: process.env.FACEPP_KEY,
      api_secret: process.env.FACEPP_SECRET,
    });
    if (imageUrlOrBase64.startsWith('http')) form.set('image_url', imageUrlOrBase64);
    else form.set('image_base64', imageUrlOrBase64);

    const res = await fetchWithTimeout(url, { method: 'POST', body: form });
    if (!res.ok) throw new Error(`face++ ${res.status}`);
    const data = await jsonOrError(res);
    breaker.recordSuccess();
    return { provider: 'face++', data };
  } catch (e) {
    breaker.recordFailure();
    return { provider: 'face++', error: e.message };
  }
}
module.exports = { searchFacePP };