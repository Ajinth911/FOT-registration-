import express from "express";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";

const router = express.Router();

export function createToken(payload) {
  const secret = process.env.JWT_SECRET || "mark9_admin_secret_key_2026";

  const header = Buffer.from(
    JSON.stringify({ alg: "HS256", typ: "JWT" })
  ).toString("base64url");

  const exp = Math.floor(Date.now() / 1000) + 24 * 60 * 60;

  const body = Buffer.from(
    JSON.stringify({ ...payload, exp })
  ).toString("base64url");

  const signature = crypto
    .createHmac("sha256", secret)
    .update(`${header}.${body}`)
    .digest("base64url");

  return `${header}.${body}.${signature}`;
}

export function verifyToken(token) {
  if (!token) return null;

  try {
    const parts = token.split(".");

    if (parts.length !== 3) return null;

    const [header, body, signature] = parts;

    const secret =
      process.env.JWT_SECRET || "mark9_admin_secret_key_2026";

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${header}.${body}`)
      .digest("base64url");

    if (signature !== expectedSignature) return null;

    const payload = JSON.parse(
      Buffer.from(body, "base64url").toString()
    );

    if (
      payload.exp &&
      payload.exp < Math.floor(Date.now() / 1000)
    ) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

// Authentication middleware
export function requireAdminAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (
    !authHeader ||
    !authHeader.startsWith("Bearer ")
  ) {
    return res.status(401).json({
      message: "Authorization required. Please log in as admin.",
    });
  }

  const token = authHeader.split(" ")[1];
  const payload = verifyToken(token);

  if (!payload) {
    return res.status(401).json({
      message: "Invalid or expired session. Please log in again.",
    });
  }

  req.admin = payload;
  next();
}

// Login route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required.",
    });
  }

  try {
    // Find admin in MongoDB
    const admin = await Admin.findOne({
      username: username.trim().toLowerCase(),
    });
   

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin username or password.",
      });
    }

    // Compare entered password with hashed password
    const passwordMatch = await bcrypt.compare(
      password,
      admin.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin username or password.",
      });
    }

    // Create JWT
    const token = createToken({
      id: admin._id.toString(),
      username: admin.username,
      role: admin.role,
      loginTime: new Date().toISOString(),
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: admin._id,
        username: admin.username,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error during admin login.",
    });
  }
});

// Verify token route
router.get("/verify", (req, res) => {
  const authHeader = req.headers.authorization;

  if (
    !authHeader ||
    !authHeader.startsWith("Bearer ")
  ) {
    return res.status(401).json({
      valid: false,
      message: "No token provided.",
    });
  }

  const token = authHeader.split(" ")[1];
  const payload = verifyToken(token);

  if (!payload) {
    return res.status(401).json({
      valid: false,
      message: "Token is invalid or expired.",
    });
  }

  return res.status(200).json({
    valid: true,
    user: payload,
  });
});

export default router;