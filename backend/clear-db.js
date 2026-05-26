require("dotenv").config({ path: __dirname + "/.env" });
const mongoose = require("mongoose");

async function clearDB() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("❌ MONGO_URI not found in .env");
    }

    console.log("Connecting using:", uri);

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 30000,
    });

    console.log("✅ Connected to MongoDB");

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();

    console.log("📌 Collections:", collections.map(c => c.name));

    for (let collection of collections) {
      await db.collection(collection.name).deleteMany({});
      console.log(`🗑️ Cleared: ${collection.name}`);
    }

    console.log("🎉 All collections cleared successfully!");
    process.exit(0);

  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}
clearDB();