require("dotenv").config();
const bcrypt = require("bcryptjs");
const connectDB = require("./config");
const User = require("./User/User");
const Product = require("../models/Product");
const Alert = require("../models/Alert");

(async () => {
  await connectDB();
  await Product.deleteMany({});
  await Product.insertMany([
    { name: "Hybrid Wheat Seeds HD-2967", category: "seeds", price: 850, unit: "10 kg bag", stock: 120, description: "High-yield, rust-resistant wheat variety." },
    { name: "Basmati Rice Seeds", category: "seeds", price: 1200, unit: "10 kg bag", stock: 80, description: "Premium aromatic paddy seeds." },
    { name: "Tomato Seeds (F1 Hybrid)", category: "seeds", price: 450, unit: "50 g pack", stock: 200, description: "Disease tolerant, high-yield tomato." },
    { name: "Urea (46% N)", category: "fertilizers", price: 270, unit: "45 kg bag", stock: 300, description: "Nitrogen fertilizer for vegetative growth." },
    { name: "DAP Fertilizer", category: "fertilizers", price: 1350, unit: "50 kg bag", stock: 150, description: "Di-ammonium phosphate for root development." },
    { name: "Organic Vermicompost", category: "fertilizers", price: 400, unit: "25 kg bag", stock: 90, description: "Improves soil structure and microbial life." },
    { name: "Neem Oil Pesticide", category: "pesticides", price: 320, unit: "1 L", stock: 140, description: "Organic broad-spectrum pest repellent." },
    { name: "Imidacloprid 17.8% SL", category: "pesticides", price: 540, unit: "250 ml", stock: 100, description: "Systemic insecticide for sucking pests." },
    { name: "Battery Knapsack Sprayer", category: "equipment", price: 3200, unit: "piece", stock: 25, description: "16 L rechargeable sprayer." },
    { name: "Tractor Rental (per day)", category: "service", price: 2500, unit: "day", stock: 10, description: "45 HP tractor with operator." },
    { name: "Expert Agronomist Consultation", category: "service", price: 500, unit: "session", stock: 50, description: "One-hour field or video consultation." }
  ]);
  await Alert.deleteMany({});
  await Alert.insertMany([
    { title: "Fall armyworm risk", crop: "Maize", severity: "high", message: "Warm humid weather favours armyworm outbreaks.", treatment: "Scout whorls; spray Emamectin benzoate 0.4 g/L." },
    { title: "Late blight warning", crop: "Tomato", severity: "medium", message: "Cool wet nights increase blight risk.", treatment: "Preventive Mancozeb spray at 2.5 g/L." },
    { title: "Aphid build-up", crop: "Wheat", severity: "low", message: "Aphid populations rising in northern plains.", treatment: "Neem oil 5 ml/L or Imidacloprid if severe." }
  ]);
  const email = "admin@agritech.com";
  if (!(await User.findOne({ email }))) {
    await User.create({ name: "Admin", email, password: await bcrypt.hash("admin123", 10), role: "admin", isVerified: true });
  }
  console.log("Seed complete. Admin login: admin@agritech.com / admin123");
  process.exit(0);
})();
