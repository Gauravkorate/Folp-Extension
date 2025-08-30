// ⚠️ PimEyes has no official public API. This stub demonstrates a guarded call pattern.
const { Breaker } = require('../utils/breaker');
const breaker = new Breaker();

async function searchPimEyes(/* image data */) {
  if (!process.env.PIMEYES_COOKIE) return { skipped: 'PimEyes cookie missing' };
  if (!breaker.canTry()) return { skipped: 'pimeyes circuit open' };
  try {
    // Intentionally not implemented to avoid scraping policy issues.
    // You can integrate your own compliant workflow here.
    return { provider: 'pimeyes', error: 'not_implemented' };
  } catch (e) {
    breaker.recordFailure();
    return { provider: 'pimeyes', error: e.message };
  }
}
module.exports = { searchPimEyes };