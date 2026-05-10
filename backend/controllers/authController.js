import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import sgMail from '@sendgrid/mail'



dotenv.config();

console.log('SendGrid API key loaded:', process.env.SENDGRID_API_KEY);
sgMail.setApiKey(process.env.SENDGRID_API_KEY);



// REGISTER
export const register = async (req, res) => {
  try {
    const { name, email, password, role = 'user' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ msg: 'All fields are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      role,
    });

    res.status(201).json({
      msg: 'User registered',
      data: { role: user.role }
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ msg: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid email or password' });

    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// FORGOT PASSWORD


export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '2h' });

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;
 ;

    const msg = {
      to: user.email,
      from: process.env.EMAIL_FROM,
      subject: 'Password Reset Link',
      html: `
        <h3>Password Reset Request</h3>
        <p> Are you want to change the password if you want to click <a href="${resetLink}">here</a> to reset your password.</p>
        <p>This link will expire in 1 hour.</p>
      `,
    };

    await sgMail.send(msg);

    res.status(200).json({ message: 'Reset link sent to your email.' });
  } catch (error) {
    console.error('SendGrid Error:', error);
    res.status(500).json({ message: 'Server error while sending email' });
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    console.log("Token received:", token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    console.log("Decoded token:", decoded);

    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ message: 'User not found' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    await user.save();
    console.log("Password updated and saved for user:", user.email);

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};
