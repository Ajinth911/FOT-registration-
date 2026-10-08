import express from "express";
import Event from "../models/Event.js";
import { requireAdminAuth, verifyToken } from "./authRoutes.js";

const router = express.Router();

// Flexible admin authorization middleware supporting JWT token, admin key, or local dev mode
const verifyAdminAccess = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const adminKey = req.headers["x-admin-key"];
  const validPass = process.env.ADMIN_PASSWORD || "admin123";

  if (adminKey === validPass) {
    return next();
  }

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    const payload = verifyToken(token);
    if (payload) {
      req.admin = payload;
      return next();
    }
  }

  // In local development mode, allow seamless admin edits
  if (process.env.NODE_ENV !== "production") {
    return next();
  }

  return res.status(401).json({ message: "Authorization required. Please log in as admin." });
};

const DEFAULT_EVENT_DATA = {
  title: "𝐌𝐚𝐤𝐤𝐚 𝐃𝐞𝐬𝐢𝐠𝐧 𝐏𝐚𝐤𝐤𝐚",
  plainTitle: "Makka Design Pakka",
  category: "Arts & Culture",
  coverImage:
    "https://images.lumacdn.com/uploads/7t/8bd0d1df-05ba-4aa7-bac6-c9b5a897bee5.png",
  hostName: "MaRK9.",
  hostAvatar:
    "https://images.lumacdn.com/uploads/af/75092537-f641-4d7d-ac18-0c937d058c0f.jpg",
  hostVerified: true,
  startDate: "2026-10-03",
  startTime: "10:00 AM",
  endTime: "12:00 PM",
  timezone: "Asia/Kolkata",
  locationName: "MARK9",
  locationAddress:
    "121/C, Kottar-Parvathipuram Rd, Chetti Kulam, Simon Nagar, Nagercoil, Tamil Nadu 629001, India",
  locationDescription: "2nd Floor, MARK9 Office",
  cityState: "Nagercoil, India",
  latitude: 8.174926,
  longitude: 77.4307038,
  googleMapsUrl:
    "https://www.google.com/maps/search/?api=1&query=8.174926%2C77.4307038&query_place_id=ChIJDaP2x67xBDsRaOocAe7bZ7o",
  registrationStatus: "closed",
  ticketPrice: "₹99",
  ticketName: "General Admission",
  guestCount: 42,
  guestSummary: "Thanisha N, Gokul Krishna and 40 others",
  featuredGuests: [
    {
      name: "Thanisha N",
      avatar: "https://cdn.lu.ma/avatars-default/avatar_17.png",
    },
    {
      name: "Gokul Krishna",
      avatar: "https://cdn.lu.ma/avatars-default/avatar_43.png",
    },
    {
      name: "Muthu Maheswari M",
      avatar: "https://cdn.lu.ma/avatars-default/avatar_24.png",
    },
    {
      name: "Abish",
      avatar: "https://cdn.lu.ma/avatars-default/avatar_34.png",
    },
    {
      name: "Jothisha",
      avatar: "https://cdn.lu.ma/avatars-default/avatar_5.png",
    },
    {
      name: "Heamanth S",
      avatar: "https://cdn.lu.ma/avatars-default/avatar_1.png",
    },
    {
      name: "Anish.M",
      avatar: "https://cdn.lu.ma/avatars-default/avatar_31.png",
    },
    {
      name: "Ashik D",
      avatar:
        "https://images.lumacdn.com/uploads/qv/66016de2-977e-4590-a4f0-756535863b0c.png",
    },
  ],
  aboutHeadline: "WHAT IF YOUR NEXT IDEA CHANGES EVERYTHING?",
  aboutParagraphs: [
    "Can you turn a colour into a feeling?",
    "What happens when you put curiosity, creativity & people in the same room?\nMaybe you create something unexpected.\nMaybe you discover a new way to think.\nMaybe you meet people who see design differently.",
    "Or maybe… you discover a side of your creativity you haven't explored yet.",
    "THIS ISN'T JUST ABOUT DESIGN.",
    "No experience.\nNo perfect portfolio.\nNo rules about how creative you should be.",
    "Just bring your curiosity.",
    "03.10.2026\n10:00 AM - 12:00 PM\nNagercoil, Kanyakumari",
    "For students, designers, freshers, freelancers, working professionals & curious minds.\n\nYour seat in the community awaits — Register for ₹99",
  ],
  contactPhone: "99945 35121",
  contactWebsite: "https://www.mark9.cc/",
  lumaOriginalUrl: "https://luma.com/fk3rbn8c",
};

// In-memory fallback if MongoDB connection is unavailable
let memoryEventData = { ...DEFAULT_EVENT_DATA };

// GET current event data (Public)
router.get("/", async (req, res) => {
  try {
    let event = await Event.findOne();
    if (!event) {
      // Seed initial record if none exists
      try {
        event = await Event.create(DEFAULT_EVENT_DATA);
      } catch (dbErr) {
        // If create fails, return in-memory
        return res.status(200).json(memoryEventData);
      }
    }
    return res.status(200).json(event);
  } catch (error) {
    console.warn("DB read error in /api/event, returning fallback data:", error.message);
    return res.status(200).json(memoryEventData);
  }
});

// UPDATE event details (Protected by verifyAdminAccess)
router.put("/", verifyAdminAccess, async (req, res) => {
  try {
    const updateData = req.body;
    let event = await Event.findOne();

    if (!event) {
      event = await Event.create({
        ...DEFAULT_EVENT_DATA,
        ...updateData,
      });
    } else {
      Object.assign(event, updateData);
      await event.save();
    }

    memoryEventData = { ...DEFAULT_EVENT_DATA, ...updateData };
    return res.status(200).json({
      success: true,
      message: "Event details updated successfully.",
      data: event,
    });
  } catch (error) {
    console.error("Error updating event in database:", error);
    // Even if DB fails, update memory store so changes persist in session
    memoryEventData = { ...memoryEventData, ...req.body };
    return res.status(200).json({
      success: true,
      message: "Event details updated in local memory store.",
      data: memoryEventData,
    });
  }
});

// RESET event to default fk3rbn8c values (Protected)
router.post("/reset", verifyAdminAccess, async (req, res) => {
  try {
    let event = await Event.findOne();
    if (event) {
      await Event.deleteMany({});
    }
    event = await Event.create(DEFAULT_EVENT_DATA);
    memoryEventData = { ...DEFAULT_EVENT_DATA };
    return res.status(200).json({
      success: true,
      message: "Event reset to original Luma event details.",
      data: event,
    });
  } catch (error) {
    memoryEventData = { ...DEFAULT_EVENT_DATA };
    return res.status(200).json({
      success: true,
      message: "Event reset to default memory data.",
      data: memoryEventData,
    });
  }
});

export default router;
