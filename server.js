const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// In-memory storage (replace with DB later)
let users = {};
let sosLogs = [];

// Registration
app.post('/register', async (req,res)=>{
  const {username, password} = req.body;
  if(!username || !password) return res.status(400).send("Username and password required");
  if(users[username]) return res.status(400).send("User already exists");
  const hash = await bcrypt.hash(password, 10);
  users[username] = {password: hash, contacts: []};
  res.send("Registered successfully");
});

// Login
app.post('/login', async (req,res)=>{
  const {username, password} = req.body;
  const user = users[username];
  if(!user) return res.status(400).send("No user found");
  const match = await bcrypt.compare(password, user.password);
  if(match) res.send("Login successful");
  else res.status(400).send("Invalid credentials");
});

// Add Contact
app.post('/contacts', (req,res)=>{
  const {username, contact} = req.body;
  if(!users[username]) return res.status(400).send("User not found");
  users[username].contacts.push(contact);
  res.send("Contact added");
});

// Get Contacts
app.get('/contacts/:username', (req,res)=>{
  const user = users[req.params.username];
  if(!user) return res.status(400).send("User not found");
  res.json(user.contacts);
});

// SOS Alert
app.post('/sos', (req,res)=>{
  const {username, location, message} = req.body;
  sosLogs.push({username, location, message, time:new Date()});
  console.log(`🚨 SOS from ${username}: ${message} at ${location}`);
  res.send("SOS alert logged");
});

// Get SOS Logs (optional admin route)
app.get('/soslogs', (req,res)=>{
  res.json(sosLogs);
});

app.listen(3000, ()=>console.log("✅ Backend running on http://localhost:3000"));
