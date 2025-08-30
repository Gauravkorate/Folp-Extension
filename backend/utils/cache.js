class TTLCache {
  constructor(ttlMs = 600000) { // default 10 min
    this.ttl = ttlMs;
    this.map = new Map();
  }
  _now() { return Date.now(); }
  get(key) {
    const v = this.map.get(key);
    if (!v) return undefined;
    if (this._now() > v.expires) { this.map.delete(key); return undefined; }
    return v.value;
  }
  set(key, value, ttlMs = this.ttl) {
    this.map.set(key, { value, expires: this._now() + ttlMs });
  }
}
module.exports = { TTLCache };