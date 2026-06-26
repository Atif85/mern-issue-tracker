import { sign } from 'jsonwebtoken';
import User, { findOne } from '../models/User';

export async function registerUser(req, res) {
  try {
    const { username, email, password, inviteCode } = req.body;

    // Verify invite code
    if (inviteCode !== process.env.INVITE_CODE) {
      return res.status(401).json({ message: 'Invalid invite code' });
    }

    // Validate input fields
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'Username or Email already exists' });
    }

    // Create and save new user (Pre-save hook handles hashing)
    const newUser = new User({ username, email, password });
    await newUser.save();

    // Generate JWT token
    const token = sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
}

export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Find user by email
    const user = await findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Validate password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
}

export default router;
