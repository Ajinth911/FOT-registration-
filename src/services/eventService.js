// Service for fetching and updating Event details with MongoDB + localStorage resilience

const STORAGE_KEY = "fot_luma_event_data";

export const DEFAULT_LUMA_EVENT = {
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
  registrationStatus: "closed", // "closed" | "open" | "sold-out" | "waitlist"
  ticketPrice: "₹99",
  ticketName: "General Admission",
  guestCount: 42,
  guestSummary: "Thanisha N, Gokul Krishna and 40 others",
  featuredGuests: [
    {
      name: "Thanisha N",
      avatar: "https://cdn.lu.ma/avatars-default/avatar_17.png",
      role: "Participant",
    },
    {
      name: "Gokul Krishna",
      avatar: "https://cdn.lu.ma/avatars-default/avatar_43.png",
      role: "Participant",
    },
    {
      name: "Muthu Maheswari M",
      avatar: "https://cdn.lu.ma/avatars-default/avatar_24.png",
      role: "Designer",
    },
    {
      name: "Abish",
      avatar: "https://cdn.lu.ma/avatars-default/avatar_34.png",
      role: "Student",
    },
    {
      name: "Jothisha",
      avatar: "https://cdn.lu.ma/avatars-default/avatar_5.png",
      role: "Participant",
    },
    {
      name: "Heamanth S",
      avatar: "https://cdn.lu.ma/avatars-default/avatar_1.png",
      role: "Developer",
    },
    {
      name: "Anish.M",
      avatar: "https://cdn.lu.ma/avatars-default/avatar_31.png",
      role: "Creative",
    },
    {
      name: "Ashik D",
      avatar:
        "https://images.lumacdn.com/uploads/qv/66016de2-977e-4590-a4f0-756535863b0c.png",
      role: "Student",
    },
    {
      name: "Sreerevu S R",
      avatar: "https://cdn.lu.ma/avatars-default/avatar_27.png",
      role: "Participant",
    },
    {
      name: "Dashna NK",
      avatar: "https://cdn.lu.ma/avatars-default/avatar_35.png",
      role: "Participant",
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

export async function fetchEventData() {
  try {
    const res = await fetch("/api/event");
    if (res.ok) {
      const data = await res.json();
      if (data && data.title) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return data;
      }
    }
  } catch (err) {
    console.warn("Could not reach backend /api/event, checking localStorage fallback:", err);
  }

  // Fallback to localStorage
  try {
    const local = localStorage.getItem(STORAGE_KEY);
    if (local) {
      return JSON.parse(local);
    }
  } catch (e) {
    console.error("Local storage parse error:", e);
  }

  return DEFAULT_LUMA_EVENT;
}

export async function updateEventData(updatedEvent, adminToken) {
  // Update local storage immediately for zero-latency UI reactivity
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEvent));
  } catch (e) {
    console.error("Local storage write error:", e);
  }

  try {
    const headers = {
      "Content-Type": "application/json",
    };
    if (adminToken) {
      headers.Authorization = `Bearer ${adminToken}`;
    }

    const res = await fetch("/api/event", {
      method: "PUT",
      headers,
      body: JSON.stringify(updatedEvent),
    });

    if (res.ok) {
      const json = await res.json();
      return json.data || updatedEvent;
    }
  } catch (err) {
    console.warn("Backend update failed, saved to localStorage:", err);
  }

  return updatedEvent;
}

export async function resetEventData(adminToken) {
  try {
    const headers = { "Content-Type": "application/json" };
    if (adminToken) {
      headers.Authorization = `Bearer ${adminToken}`;
    }

    const res = await fetch("/api/event/reset", {
      method: "POST",
      headers,
    });

    if (res.ok) {
      const json = await res.json();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(json.data || DEFAULT_LUMA_EVENT));
      return json.data || DEFAULT_LUMA_EVENT;
    }
  } catch (err) {
    console.warn("Backend reset failed, resetting local storage:", err);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_LUMA_EVENT));
  return DEFAULT_LUMA_EVENT;
}
