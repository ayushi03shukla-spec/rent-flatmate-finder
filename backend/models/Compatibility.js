const { GoogleGenerativeAI } = require("@google/generative-ai");

const TenantProfile = require("../models/TenantProfile");
const Listing = require("../models/Listing");
const Compatibility = require("../models/Compatibility");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Rule-based fallback
function fallbackScore(profile, listing) {
  let score = 0;
  let reasons = [];

  if (
    profile.preferredLocation.toLowerCase() ===
    listing.city.toLowerCase()
  ) {
    score += 40;
    reasons.push("Preferred location matches");
  }

  if (
    listing.rent >= profile.minBudget &&
    listing.rent <= profile.maxBudget
  ) {
    score += 40;
    reasons.push("Budget matches");
  }

  if (
    profile.foodPreference === "Both" ||
    profile.foodPreference === listing.foodPreference
  ) {
    score += 20;
    reasons.push("Food preference matches");
  }

  return {
    score,
    explanation: reasons.join(", "),
  };
}

async function generateCompatibility(
  tenantId,
  listingId
) {
  // Already generated?
  const existing = await Compatibility.findOne({
    tenant: tenantId,
    listing: listingId,
  });

  if (existing) return existing;

  const profile = await TenantProfile.findOne({
    tenant: tenantId,
  });

  const listing = await Listing.findById(listingId);

  if (!profile || !listing) {
    throw new Error("Profile or Listing not found");
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
You are a flatmate compatibility expert.

Tenant Profile:
${JSON.stringify(profile)}

Listing:
${JSON.stringify(listing)}

Return ONLY valid JSON.

Example:

{
"score":92,
"explanation":"Budget and preferred location are an excellent match."
}
`;

    const result = await model.generateContent(prompt);

    const text = result.response.text();

    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    const compatibility = await Compatibility.create({
      tenant: tenantId,
      listing: listingId,
      score: parsed.score,
      explanation: parsed.explanation,
    });

    return compatibility;

  } catch (err) {
    console.log("Gemini failed. Using fallback...");

    const fallback = fallbackScore(
      profile,
      listing
    );

    const compatibility = await Compatibility.create({
      tenant: tenantId,
      listing: listingId,
      score: fallback.score,
      explanation: fallback.explanation,
    });

    return compatibility;
  }
}

module.exports = {
  generateCompatibility,
};