import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || "mongodb://localhost:27017/ecommerce";
    await mongoose.connect(uri);
    console.log("✅ MongoDB conectado - Base de datos: ecommerce");
  } catch (error) {
    console.error("❌ Error al conectar MongoDB:", error.message);
    process.exit(1);
  }
};
