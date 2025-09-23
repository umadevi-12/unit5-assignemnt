import jwt from "jsonwebtoken";

// Verify JWT token
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1]; // Bearer TOKEN
  if (!token) return res.status(401).json({ message: "Token missing" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Debugging
    console.log("Decoded token:", decoded);

    req.userId = decoded.id;
    req.userRole = decoded.role;

    console.log("req.userId set to:", req.userId);
    console.log("req.userRole set to:", req.userRole);

    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

// Admin role check
export const isAdmin = (req, res, next) => {
  if (req.userRole !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};
