require("dotenv").config({ path: __dirname + "/.env" });
const mongoose = require("mongoose");
const Institution = require("./models/institution.model");

const addSampleInstitution = async () => {
  try {
    const uri =
      process.env.MONGODB_URI ||
      process.env.MONGO_URI ||
      process.env.MONGO_URL;

    if (!uri) {
      throw new Error("❌ No MongoDB connection string found in .env");
    }

    console.log("📡 Connecting to:", uri);
    await mongoose.connect(uri);

    console.log("✅ Connected to MongoDB");

    const sampleInstitution = {
      name: "Sample Institute of Technology",
      shortName: "SIT",
      aisheCode: "U-0001",
      location: "Mumbai, Maharashtra",
      type: "Government",
      accreditation: "A++",
      nirfScore: 85.5,
      ranking: 10,
      compliance: 95,
      students: 1000,
      faculty: 100,
      departments: 10,
      established: 1995,
      placement: 82,
    };

    const institution = await Institution.create(sampleInstitution);

    console.log("✅ Sample institution created:", institution._id);
    console.log("➡️ Use this ID for testing:", institution._id.toString());

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

addSampleInstitution();