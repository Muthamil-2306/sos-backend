import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Supabase connection
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// ✅ Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "✅ Backend is running with Supabase!" });
});

// 🚨 Add SOS alert
app.post("/api/sos", async (req, res) => {
  const { user_id, message, location } = req.body;

  const { data, error } = await supabase
    .from("alerts")
    .insert([{ user_id, message, location, timestamp: new Date().toISOString() }])
    .select();

  if (error) return res.status(400).json({ error: error.message });
  res.json({ success: true, alert: data });
});

// 📜 Get alerts for a user
app.get("/api/alerts/:user_id", async (req, res) => {
  const { user_id } = req.params;

  const { data, error } = await supabase
    .from("alerts")
    .select("*")
    .eq("user_id", user_id)
    .order("timestamp", { ascending: false });

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// 👥 Add a contact
app.post("/api/contacts", async (req, res) => {
  const { user_id, contact_name, contact_number } = req.body;

  const { data, error } = await supabase
    .from("contacts")
    .insert([{ user_id, contact_name, contact_number }])
    .select();

  if (error) return res.status(400).json({ error: error.message });
  res.json({ success: true, contact: data });
});

// 📜 Get contacts for a user
app.get("/api/contacts/:user_id", async (req, res) => {
  const { user_id } = req.params;

  const { data, error } = await supabase
    .from("contacts")
    .select("*")
    .eq("user_id", user_id);

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// 👤 Register a user
app.post("/api/users", async (req, res) => {
  const { name, email, phone, password_hash } = req.body;

  const { data, error } = await supabase
    .from("users")
    .insert([{ name, email, phone, password_hash }])
    .select();

  if (error) return res.status(400).json({ error: error.message });
  res.json({ success: true, user: data });
});

// 📜 Get all users
app.get("/api/users", async (req, res) => {
  const { data, error } = await supabase
    .from("users")
    .select("*");

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
