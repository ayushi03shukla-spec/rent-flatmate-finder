const { GoogleGenAI } = require("@google/genai");
console.log("Gemini Key:", process.env.GEMINI_API_KEY);

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Rule-based fallback
const fallbackCompatibility = (profile, listing) => {
  let score = 0;
  let reasons = [];

  if (
    profile.preferredLocation.toLowerCase() ===
    listing.city.toLowerCase()
  ) {
    score += 50;
    reasons.push("Preferred location matches.");
  }

  if (
    listing.rent >= profile.minBudget &&
    listing.rent <= profile.maxBudget
  ) {
    score += 50;
    reasons.push("Rent is within budget.");
  }

  return {
    score,
    explanation:
      reasons.length > 0
        ? reasons.join(" ")
        : "Low compatibility.",
  };
};

const calculateCompatibility = async (profile, listing) => {
  try {
    console.log("🚀 Calling Gemini...");

   const prompt = `
Analyze how well this tenant matches this room.

Tenant:
Preferred Location: ${profile.preferredLocation}
Budget: ${profile.minBudget}-${profile.maxBudget}

Listing:
City: ${listing.city}
Rent: ${listing.rent}
Room Type: ${listing.roomType}

Return ONLY valid JSON.

{"score":0,"explanation":""}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = response.text;

    console.log("Gemini Response:");
    console.log(text);

    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
      console.log("Cleaned Response:");
      console.log(cleaned);

    return JSON.parse(cleaned);

  } catch (error) {
    console.error("Gemini Error:", error);

    console.log("⚠️ Using Rule-Based Fallback");

    return fallbackCompatibility(profile, listing);
  }
};

module.exports = {
  calculateCompatibility,
};