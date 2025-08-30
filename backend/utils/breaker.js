 

// Tiny circuit breaker per provider
class Breaker {
  constructor({ failureThreshold = 5, cooldownMs = 30000 } = {}) {
    this.failures = 0;
    this.openedAt = 0;
    this.failureThreshold = failureThreshold;
    this.cooldownMs = cooldownMs;
  }
  canTry() {
    if (this.failures < this.failureThreshold) return true;
    return (Date.now() - this.openedAt) > this.cooldownMs;
  }
  recordSuccess() { this.failures = 0; this.openedAt = 0; }
  recordFailure() {
    this.failures++;
    if (this.failures >= this.failureThreshold && !this.openedAt) this.openedAt = Date.now();
  }
}
module.exports = { Breaker };