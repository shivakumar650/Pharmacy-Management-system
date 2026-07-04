const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin"); // make sure this exists

// ======================
// REGISTER (run once)
// ======================
exports.registerAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const existing = await Admin.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new Admin({
      email,
      password: hashedPassword
    });

    await admin.save();

    res.json({ message: "Admin registered successfully" });
  } catch (err) {
    next(err);
  }
};

// ======================
// LOGIN
// ======================
exports.loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ 
      token,
      user: {
        id: admin._id,
        email: admin.email,
        name: 'Admin',
        role: 'Administrator'
      }
    });
  } catch (err) {
    next(err);
  }
};
