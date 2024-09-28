

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Role = require('../models/Role');

const User = require('../models/Auth');
const Property = require('../models/RealEstate');
const nodemailer = require('nodemailer');


// update_proprety_active_status
const update_proprety_active_status = async (req, res) => {
  try {
    const { _id } = req.body;

    if (!_id) {
      return res.status(400).json({ message: '_id is required in the request body' });
    }

    const property = await Property.findOne({ _id });

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Update property active status
    property.active = !property.active;
    await property.save();

    // Extract userId from the property
    const { userId, name } = property;

    // Find user in the User table
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Extract email from the user
    const { email } = user;

    // Send email using nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'dollarrami75@gmail.com',
        pass: 'tdco ogya momt kdee'
      }
    });

    const mailOptions = {
      from: 'dollarrami75@gmail.com',
      to: email,
      subject: 'Property Activation Status Updated',
      html: `
        <div style="background-color: #f8f9fa; padding: 20px;">
          <h1 style="color: #343a40; text-align: center; font-family: Arial, sans-serif;">HARMOGHAR TEAM</h1>
          <p style="color: #343a40;font-weight: bold; font-family: Arial, sans-serif;">
            Dear ${user.name},
            <br><br>
            Your property "${name}" activation status has been updated successfully.
          </p>
          <p style="color: #343a40;font-weight: bold; font-family: Arial, sans-serif;">
            Thank you for your trust.
          </p>
        </div>
      `
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

    return res.status(200).json({ message: 'Active status updated successfully and email sent' });
  } catch (err) {
    console.error('Error updating active status and sending email:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}


const get_inactive_propreties = async (req, res) => {
  console.log("get inactive property")
  try {
      const inactiveProperties = await Property.find();
      res.status(200).json(inactiveProperties);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching inactive properties', error });
    }
}
const update_active_status = async (req, res) => {
  try {
    const { _id } = req.body;

    if (!_id) {
      return res.status(400).json({ message: '_id is required in the request body' });
    }

    const role = await Role.findOne({ _id });

    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    const userId = role.userId;

    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const email = user.email;
    const isActive = role.active;
    const newStatus = !isActive;

    // Set up nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'dollarrami75@gmail.com', // replace with your email
        pass: 'tdco ogya momt kdee', // replace with your email password
      },
    });

    // Luxurious and complicated email content
    const mailOptions = {
      from: 'dollarrami75@gmail.com', // replace with your email
      to: email,
      subject: 'Account Status Update',
      html: `
        <div style="font-family: 'Times New Roman', serif; max-width: 600px; margin: auto; padding: 20px; background-color: #f0f0f0; border: 2px solid #ccc; border-radius: 10px; color: #333;">
          <h1 style="text-align: center; font-size: 2em; color: #666; text-shadow: 2px 2px #ccc;">Account Status Update</h1>
          <p style="font-size: 1.2em; text-align: justify; color: #444; border-bottom: 1px solid #ccc; padding-bottom: 10px;">Dear ${user.name},</p>
          <p style="font-size: 1.2em; text-align: justify; color: #444; padding-top: 10px;">We want to inform you that your account has been <strong>${newStatus ? 'activated' : 'deactivated'}</strong>. This change takes effect immediately.</p>
          <div style="margin-top: 30px; padding: 20px; background-color: #eee; border-radius: 10px;">
            <p style="font-size: 1.2em; text-align: justify; color: #666;">For more details, please feel free to contact us.</p>
          </div>
          <p style="font-size: 1.2em; text-align: justify; color: #444; margin-top: 30px;">Best regards,</p>
          <p style="font-size: 1.2em; text-align: justify; color: #444;">Harmoghar Team</p>
        </div>
      `,
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

    // Update role active status
    role.active = newStatus;
    await role.save();

    return res.status(200).json({ message: 'Active status updated successfully' });
  } catch (err) {
    console.error('Error updating active status:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
const get_tenant_accounts = async (req, res) => {
    try {
        const ownerAccounts = await Role.find({ role: 'tenant' });

        const userIds = ownerAccounts.map(account => account.userId);

        const users = await User.find({ _id: { $in: userIds } });

        const mergedData = ownerAccounts.map(account => {
            const userData = users.find(user => user._id.toString() === account.userId);
            return { ...account.toObject(), userData };
        });

        res.status(200).json(mergedData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}
const get_owner_accounts = async (req, res) => {
    console.log("hellllllllllllllllllllllllllllllllllllo")
    try {
        const ownerAccounts = await Role.find({ role: 'owner' });

        const userIds = ownerAccounts.map(account => account.userId);

        const users = await User.find({ _id: { $in: userIds } });

        const mergedData = ownerAccounts.map(account => {
            const userData = users.find(user => user._id.toString() === account.userId);
            return { ...account.toObject(), userData };
        });

        res.status(200).json(mergedData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}

const admin_info = async (req, res) => {
    console.log("hihdiuwhdiuwehfiuerhfiurehfiurehfiure");
    const token = req.headers.authorization.split(' ')[1];
    const secretKey = 'youtube';
  
    jwt.verify(token, secretKey, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
  
      const userId = decoded.userId;
      console.log(userId)
  
      try {
        const user = await User.findOne({ _id: userId });
        console.log(user);
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
  
        const { _id, name, email, phone, location } = user;
        return res.status(200).json({ _id, name, email, phone, location });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
    });
};




  
module.exports = { admin_info, get_owner_accounts, update_active_status, get_tenant_accounts, get_inactive_propreties, update_proprety_active_status };
