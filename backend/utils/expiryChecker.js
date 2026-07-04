// Utility to check expiry — placeholder
function getExpired(batches = []) {
  const now = new Date();
  return batches.filter(b => new Date(b.expiryDate) <= now);
}

module.exports = { getExpired };
