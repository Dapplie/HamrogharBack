const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const User = require('../models/Auth');
const Role = require('../models/Role');
const mongoose = require('mongoose');
// const elasticemail = require('elasticemail');
const crypto = require('crypto');
const JWT_SECRET = 'youtube';
const nodemailer = require('nodemailer');
// const User = require('../models/User');

const verifyEmail = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, 'youtube');
  const userId = decodedToken.userId;

  const { verificationKey } = req.body;

  try {
    const role = await Role.findOne({ userId });

    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    if (role.verificationKey !== verificationKey) {
      return res.status(400).json({ message: 'Verification key does not match' });
    }

    role.verified = true;
    await role.save();

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


const reset_password = async (req, res) => {
  console.log("hiufhiuhfriurehfiure");

  const { email, resetKey, password } = req.body;

  try {
    // Find the user by email (case-insensitive)
    const user = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify the reset key
    const isResetKeyValid = await argon2.verify(user.resetKey, resetKey);

    if (!isResetKeyValid) {
      return res.status(400).json({ message: 'Invalid reset key' });
    }

    // Encrypt the new password
    const hashedPassword = await argon2.hash(password);

    // Update the user's password and remove the reset key
    user.password = hashedPassword;
    user.resetKey = undefined;
    await user.save();

    return res.status(200).json({ message: 'Password reset successfully' });

  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};


const send_reset_key = async (req, res) => {
  console.log("hihfiuewhfiuehfu")
  const { email } = req.body;

  try {
    // Find the user by email (case-insensitive)
    const user = await User.findOne({ email: new RegExp('^' + email + '$', 'i') });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a reset key with 6 characters
    const resetKey = crypto.randomBytes(3).toString('hex');

    // Encrypt the reset key using Argon2
    const hashedResetKey = await argon2.hash(resetKey);

    // Store the encrypted reset key in the user's record
    user.resetKey = hashedResetKey;
    await user.save();

    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // You can use other services like 'Yahoo', 'Outlook', etc.
      auth: {
        user: 'dollarrami75@gmail.com', // Replace with your email
        pass: 'tdco ogya momt kdee', // Replace with your email password or app-specific password
      },
    });

    // Send the reset key to the user's email
    const mailOptions = {
      from: 'dollarrami75@gmail.com', // Replace with your email
      to: email,
      subject: 'Exclusive Password Reset Key',
      html: `
        <div style="font-family: 'Georgia', serif; background-color: #f4f4f9; padding: 20px; border-radius: 15px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
          <div style="background-color: #dceefb; border-radius: 15px; padding: 20px; text-align: center;">
            <h1 style="color: #1e3a8a; font-size: 36px;">Dhaam</h1>
            <p style="color: #1c3d5a; font-size: 18px;">Dear ${user.name},</p>
            <p style="color: #1c3d5a; font-size: 18px;">Your exclusive password reset key is:</p>
            <p style="color: #2563eb;letter-spacing:1.5; font-size: 30px; font-weight: bold; padding: 10px; background-color: #e0f2fe; border-radius: 10px; display: inline-block;">${resetKey}</p>
            <p style="color: #1c3d5a; font-size: 18px;">Please use this key to reset your password.</p>
            <p style="color: #1c3d5a; font-size: 18px;">Thank you for being a valued member of Dhaam.</p>
            <p style="color: #1c3d5a; font-size: 18px;">Best regards,</p>
            <p style="color: #1c3d5a; font-size: 18px;">Dhaam Team</p>
          </div>
          <footer style="text-align: center; padding: 10px 0; color: #6b7280;">
            <p>&copy; 2024 Dhaam. All rights reserved.</p>
          </footer>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: 'Reset key generated, encrypted, stored, and email sent successfully' });

  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};





const change_password = async (req, res) => {
  try {
    console.log("hiewuhfiuwfehiurhfu")
    // Extract the token from the authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization header missing or invalid' });
    }

    const token = authHeader.split(' ')[1];

    // Verify and decode the token
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    // Extract currentPassword and newPassword from request body
    const { currentPassword, newPassword } = req.body;

    // Find the user by userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify the current password
    const validPassword = await argon2.verify(user.password, currentPassword);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid current password' });
    }

    // Hash the new password
    const hashedNewPassword = await argon2.hash(newPassword);

    // Update the user's password
    user.password = hashedNewPassword;
    await user.save();

    // Send a success response
    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

const signup = async (req, res) => {
  console.log("hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    let { email, password, name, phone, roleName, selectedDate, showDatePicker, idVerification, location } = req.body;
    console.log(req.body);
    if (roleName == 'owner' && !idVerification){
      return res.status(400).json({ message: 'id required' });

    }
    if ((roleName === 'tenant' || roleName === 'Tenant') && !idVerification) {
      idVerification = 'still not set';
    }
    // Check if user with same email exists
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Hash the password
    const hashedPassword = await argon2.hash(password);

    // Create a new user
    const newUser = new User({
      email,
      password: hashedPassword,
      name,
      phone,
      selectedDate,
      showDatePicker,
      idVerification,
      location
    });

    // Save the user to the database
    await newUser.save({ session });

    // Set the active field based on the roleName
    let active = false;
    if (roleName === 'tenant') {
      active = true;
    }

    // Create or find role and store it in the database
    let role = await Role.findOne({ role: roleName, userId: newUser._id.toString() });
    if (!role) {
      role = new Role({ role: roleName, userId: newUser._id.toString(), active, verificationKey: generateVerificationKey(), verified:false });
    } else {
      role.active = active;
    }

    // Save the role to the database
    await role.save({ session });

    // Send verification key via email
    await sendVerificationEmail(email, role.verificationKey, name);

    // Commit the transaction
    await session.commitTransaction();

    // Generate a JWT token
    const token = jwt.sign({ userId: newUser._id, role: roleName }, JWT_SECRET, { expiresIn: '1y' });

    // Send the token in the response
    res.status(201).json({ token });
  } catch (error) {
    console.error(error);
    await session.abortTransaction();
    let message = 'Internal Server Error';
    if (error.code === 11000) {
      message = 'Email already in use';
    } else if (error.name === 'ValidationError') {
      message = Object.values(error.errors).map((e) => e.message).join(', ');
    }
    res.status(500).json({ message });
  } finally {
    session.endSession();
  }
};

const generateVerificationKey = () => {
  const min = 100000;
  const max = 999999;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const sendVerificationEmail = async (email, verificationKey, name) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'dollarrami75@gmail.com', // Replace with your email
      pass: 'tdco ogya momt kdee' // Replace with your password
    }
  });

  const mailOptions = {
    from: 'dollarrami75@gmail.com',
    to: email,
    subject: 'Verification Key for Signup',
    html: `
      <div style="background-color: #f0f0f0; padding: 20px;">
        <h1 style="color: #333; text-align: center; font-family: Arial, sans-serif;">Verify Your Account</h1>
        <p style="font-size: 16px; color: #666; font-family: Arial, sans-serif;">Dear ${name},</p>
        <p style="font-size: 16px; color: #666; font-family: Arial, sans-serif;">Your verification key is: <strong>${verificationKey}</strong></p>
        <p style="font-size: 16px; color: #666; font-family: Arial, sans-serif;">Thank you for signing up!</p>
        <p style="font-size: 16px; color: #666; font-family: Arial, sans-serif;">Best regards,</p>
        <p style="font-size: 16px; color: #666; font-family: Arial, sans-serif;">Dhaam Team</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

// const generateVerificationKey = () => {
//   const min = 100000;
//   const max = 999999;
//   return Math.floor(Math.random() * (max - min + 1)) + min;
// };



const login = async (req, res) => {
  console.log("hiiiiiiiiiiiiiiiiiiiiiiiiiiii")
  try {
    const { email, phone, password, role } = req.body;
    console.log(req.body);

    // Convert role to lowercase
    const lowerCaseRole = role.toLowerCase();

    // Find user by email (case-insensitive) or phone
    const user = await User.findOne({ 
      $or: [{ email: { $regex: new RegExp(email, "i") } }, { phone }] 
    });
    if (!user) {
      console.log("user not found")
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Ensure user role is defined
    if (!user.role) {
      console.log("incorrect role")
      user.role = await Role.findOne({ userId: user._id.toString() });
      if (!user.role || !user.role.verified) { // Added check for role verification
        return res.status(401).json({ message: 'Role not verified' });
      }
    }

    // Check if account is locked
    if (user.role.locked && user.role.lockExpires > new Date()) {
      return res.status(401).json({ message: 'Account locked. Please try again later.' });
    }

    // Verify password
    const validPassword = await argon2.verify(user.password, password);
    if (!validPassword || user.role.role !== lowerCaseRole) {
      // Increment failed login attempts
      if (!user.role.failedLoginAttempts) {
        user.role.failedLoginAttempts = 1;
      } else {
        user.role.failedLoginAttempts += 1;
        if (user.role.failedLoginAttempts >= 60) {
          // Lock account for 1 day
          user.role.locked = true;
          user.role.lockExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day
        }
      }
      await user.role.save();
      return res.status(401).json({ message: 'Invalid credentials or role. Please check your role.' });
    }

    // Reset failed login attempts on successful login
    user.role.failedLoginAttempts = 0;
    await user.role.save();

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id, role: user.role.role }, JWT_SECRET, { expiresIn: '1y' });

    // Send the token in the response
    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};



  
module.exports = { signup,send_reset_key, login, change_password, reset_password, verifyEmail };
