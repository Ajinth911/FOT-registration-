import express from "express";
import Registration from "../models/Registration.js";
import { requireAdminAuth } from "./authRoutes.js";

const router = express.Router();

// GET all registrations / participants (Protected: Admin only)
router.get("/", requireAdminAuth, async (req, res) => {
  try {
    const registrations = await Registration.find().sort({
      createdAt: -1,
    });

    res.status(200).json(registrations);
  } catch (error) {
    console.error("Error fetching registrations:", error);

    res.status(500).json({
      message: "Failed to fetch registrations",
    });
  }
});

// GET one registration (Protected: Admin only)
router.get("/:id", requireAdminAuth, async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);

    if (!registration) {
      return res.status(404).json({
        message: "Registration not found",
      });
    }

    res.status(200).json(registration);
  } catch (error) {
    console.error("Error fetching registration:", error);

    res.status(500).json({
      message: "Failed to fetch registration",
    });
  }
});

// CREATE a new registration (Public: attendees or admin)
router.post("/", async (req, res) => {
  try {
    const registration = new Registration(req.body);

    const savedRegistration = await registration.save();

    res.status(201).json(savedRegistration);
  } catch (error) {
    console.error("Error creating registration:", error);

    res.status(400).json({
      message: "Failed to create registration",
      error: error.message,
    });
  }
});

// BULK IMPORT registrations from CSV / parsed JSON (Protected: Admin only)
router.post("/import", requireAdminAuth, async (req, res) => {
  try {
    const rawGuests = Array.isArray(req.body) ? req.body : req.body.guests;

    if (!rawGuests || !Array.isArray(rawGuests) || rawGuests.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No guest records found to import.",
      });
    }

    const validGuests = rawGuests
      .map((item) => {
        const name = (item.name || "").toString().trim();
        const email = (item.email || "").toString().trim().toLowerCase();
        const phone = (item.phone || "").toString().trim() || "N/A";
        const college = (item.college || "").toString().trim() || "N/A";
        const department = (item.department || "").toString().trim() || "General";
        let status = (item.status || "Registered").toString().trim();

        if (!["Registered", "Confirmed", "Pending", "Cancelled"].includes(status)) {
          status = "Registered";
        }

        return {
          name,
          email,
          phone,
          college,
          department,
          status,
        };
      })
      .filter((item) => item.name && item.email);

    if (validGuests.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid guest records found. Each record must have at least a Name and Email.",
      });
    }

    // Save into MongoDB using Mongoose
    const insertedGuests = await Registration.insertMany(validGuests);

    res.status(201).json({
      success: true,
      message: `Successfully imported ${insertedGuests.length} guest(s).`,
      count: insertedGuests.length,
      data: insertedGuests,
    });
  } catch (error) {
    console.error("Error importing registrations:", error);
    res.status(500).json({
      success: false,
      message: "Failed to import registrations",
      error: error.message,
    });
  }
});

// UPDATE registration (Protected: Admin only)
router.put("/:id", requireAdminAuth, async (req, res) => {
  try {
    const updatedRegistration =
      await Registration.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!updatedRegistration) {
      return res.status(404).json({
        message: "Registration not found",
      });
    }

    res.status(200).json(updatedRegistration);
  } catch (error) {
    console.error("Error updating registration:", error);

    res.status(400).json({
      message: "Failed to update registration",
      error: error.message,
    });
  }
});

// DELETE registration (Protected: Admin only)
router.delete("/:id", requireAdminAuth, async (req, res) => {
  try {
    const deletedRegistration =
      await Registration.findByIdAndDelete(req.params.id);

    if (!deletedRegistration) {
      return res.status(404).json({
        message: "Registration not found",
      });
    }

    res.status(200).json({
      message: "Registration deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting registration:", error);

    res.status(500).json({
      message: "Failed to delete registration",
    });
  }
});

export default router;