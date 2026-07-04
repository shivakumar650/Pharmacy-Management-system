const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("Auth header received:", authHeader);

  if (!authHeader)
    return res.status(401).json({ message: "No token" });

  let token = authHeader;
  if (token.startsWith('Bearer ')) token = token.slice(7);
  if (token.startsWith('Bearer ')) token = token.slice(7); // Handle accidental double prefix
  token = token.replace(/^["']|["']$/g, ''); // Handle accidental quotes

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    console.error("JWT verify error:", err);
    res.status(401).json({ message: "Invalid token" });
  }
};
