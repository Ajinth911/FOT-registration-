import mongoose from "mongoose";

const featuredGuestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    avatar: { type: String, default: "" },
  },
  { _id: false }
);

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "𝐌𝐚𝐤𝐤𝐚 𝐃𝐞𝐬𝐢𝐠𝐧 𝐏𝐚𝐤𝐤𝐚",
      trim: true,
    },
    plainTitle: {
      type: String,
      default: "Makka Design Pakka",
      trim: true,
    },
    category: {
      type: String,
      default: "Arts & Culture",
      trim: true,
    },
    coverImage: {
      type: String,
      default:
        "https://images.lumacdn.com/uploads/7t/8bd0d1df-05ba-4aa7-bac6-c9b5a897bee5.png",
      trim: true,
    },
    hostName: {
      type: String,
      default: "MaRK9.",
      trim: true,
    },
    hostAvatar: {
      type: String,
      default:
        "https://images.lumacdn.com/uploads/af/75092537-f641-4d7d-ac18-0c937d058c0f.jpg",
      trim: true,
    },
    hostVerified: {
      type: Boolean,
      default: true,
    },
    startDate: {
      type: String,
      default: "2026-10-03",
      trim: true,
    },
    startTime: {
      type: String,
      default: "10:00 AM",
      trim: true,
    },
    endTime: {
      type: String,
      default: "12:00 PM",
      trim: true,
    },
    timezone: {
      type: String,
      default: "Asia/Kolkata",
      trim: true,
    },
    locationName: {
      type: String,
      default: "MARK9",
      trim: true,
    },
    locationAddress: {
      type: String,
      default:
        "121/C, Kottar-Parvathipuram Rd, Chetti Kulam, Simon Nagar, Nagercoil, Tamil Nadu 629001, India",
      trim: true,
    },
    locationDescription: {
      type: String,
      default: "2nd Floor, MARK9 Office",
      trim: true,
    },
    cityState: {
      type: String,
      default: "Nagercoil, India",
      trim: true,
    },
    latitude: {
      type: Number,
      default: 8.174926,
    },
    longitude: {
      type: Number,
      default: 77.4307038,
    },
    googleMapsUrl: {
      type: String,
      default:
        "https://www.google.com/maps/search/?api=1&query=8.174926%2C77.4307038&query_place_id=ChIJDaP2x67xBDsRaOocAe7bZ7o",
      trim: true,
    },
    registrationStatus: {
      type: String,
      enum: ["closed", "open", "sold-out", "waitlist"],
      default: "closed",
    },
    ticketPrice: {
      type: String,
      default: "₹99",
      trim: true,
    },
    ticketName: {
      type: String,
      default: "General Admission",
      trim: true,
    },
    guestCount: {
      type: Number,
      default: 42,
    },
    guestSummary: {
      type: String,
      default: "Thanisha N, Gokul Krishna and 40 others",
      trim: true,
    },
    featuredGuests: {
      type: [featuredGuestSchema],
      default: [
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
    },
    aboutHeadline: {
      type: String,
      default: "WHAT IF YOUR NEXT IDEA CHANGES EVERYTHING?",
      trim: true,
    },
    aboutParagraphs: {
      type: [String],
      default: [
        "Can you turn a colour into a feeling?",
        "What happens when you put curiosity, creativity & people in the same room?\nMaybe you create something unexpected.\nMaybe you discover a new way to think.\nMaybe you meet people who see design differently.",
        "Or maybe… you discover a side of your creativity you haven't explored yet.",
        "THIS ISN'T JUST ABOUT DESIGN.",
        "No experience.\nNo perfect portfolio.\nNo rules about how creative you should be.",
        "Just bring your curiosity.",
        "03.10.2026\n10:00 AM - 12:00 PM\nNagercoil, Kanyakumari",
        "For students, designers, freshers, freelancers, working professionals & curious minds.\n\nYour seat in the community awaits — Register for ₹99",
      ],
    },
    contactPhone: {
      type: String,
      default: "99945 35121",
      trim: true,
    },
    contactWebsite: {
      type: String,
      default: "https://www.mark9.cc/",
      trim: true,
    },
    lumaOriginalUrl: {
      type: String,
      default: "https://luma.com/fk3rbn8c",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.model("Event", eventSchema);
export default Event;
