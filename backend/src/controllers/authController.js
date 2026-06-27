import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const MAX_USERS = 50;

const createRecoveryCode = () => crypto.randomBytes(8).toString('hex').toUpperCase();
const hashToken = (token) =>
  crypto.createHash('sha256').update(token).digest('hex');

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return typeof email === 'string' && emailRegex.test(email);
};

export async function registerUser(req, res) {
  try {
    const { username, email, password, inviteCode } = req.body;

    if (!process.env.INVITE_CODE) {
      return res
        .status(500)
        .json({ message: 'Server not configured with invite code' });
    }

    // Verify invite code
    if (inviteCode !== process.env.INVITE_CODE) {
      return res.status(401).json({ message: 'Invalid invite code' });
    }

    // Validate input fields
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    if (password.toString().length < 6) {
      return res.status(400).json({ message: 'Min length for password is 6' });
    }

    const totalUsers = await User.countDocuments();
    if (totalUsers >= MAX_USERS) {
      return res.status(403).json({
        message:
          'User limit reached. No new accounts can be created at this time.',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'Username or Email already exists' });
    }

    const recoveryCode = createRecoveryCode();
    const recoveryCodeHash = hashToken(recoveryCode);

    // Create and save new user (Pre-save hook handles hashing)
    const newUser = new User({ username, email, password, recoveryCodeHash });
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(201).json({
      token,
      recoveryCode,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        storageUsed: newUser.storageUsed,
        storageLimit: newUser.storageLimit,
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
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Validate password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        storageUsed: user.storageUsed,
        storageLimit: user.storageLimit,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
}

export async function resetPassword(req, res) {
  try {
    const { recoveryCode, password } = req.body;
    if (!recoveryCode || !password) {
      return res
        .status(400)
        .json({ message: 'Recovery code and new password are required' });
    }

    const recoveryCodeHash = hashToken(recoveryCode);
    const user = await User.findOne({ recoveryCodeHash });

    if (!user) {
      return res.status(400).json({ message: 'Invalid recovery code' });
    }

    user.password = password;
    await user.save();

    res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error during password reset' });
  }
}

export async function deleteAccount(req, res) {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    await User.deleteOne({ _id: user._id });

    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ message: 'Server error during account deletion' });
  }
}
