const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 5000;

// --- 1. MIDDLEWARE (The Setup) ---
app.use(cors()); // Allows frontend to talk to backend
app.use(express.json()); // Allows backend to read JSON data
app.use('/uploads', express.static('uploads')); // Makes the 'uploads' folder public

// --- 2. DATABASE CONNECTION ---
// Replace 'your_mongodb_uri' with your actual connection string
mongoose.connect('mongodb://localhost:27017/farming_app')
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => console.error("❌ Connection error:", err));

// --- 3. DATA MODELS (The Schema) ---
const User = mongoose.model('User', new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true }
}, { timestamps: true }));

const Scan = mongoose.model('Scan', new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    imageUrl: String,
    comment: String
}, { timestamps: true }));

// --- 4. FILE UPLOAD SETUP (Multer) ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage: storage });

// --- 5. ROUTES (The Endpoints) ---

// Register
app.post('/auth/register', async (req, res) => {
    try {
        const newUser = new User({ email: req.body.email, passwordHash: req.body.password }); // Note: Hash this in production!
        await newUser.save();
        res.status(201).json({ message: "User registered!" });
    } catch (err) { res.status(400).json({ error: err.message }); }
});

// Login
app.post('/auth/login', async (req, res) => {
    // Logic to check user/password
    res.json({ message: "Login successful", token: "fake-jwt-token" });
});

// Create Scan (Upload Image + Comment)
app.post('/scan', upload.single('image'), async (req, res) => {
    try {
        const newScan = new Scan({
            userId: req.body.userId,
            imageUrl: req.file.path,
            comment: req.body.comment
        });
        await newScan.save();
        res.json(newScan);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Get All Scans
app.get('/scans', async (req, res) => {
    const scans = await Scan.find();
    res.json(scans);
});

// Get Specific Scan
app.get('/scans/:id', async (req, res) => {
    const scan = await Scan.findById(req.params.id);
    res.json(scan);
});

// --- 6. START SERVER ---
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

test