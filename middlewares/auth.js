const jwt = require('jsonwebtoken');
const JWT_SECRET = 'youtube';
const Role = require('../models/Role');

 const OwnerAuthenticated = async (req, res, next) => {
  try {
    // Check if token is present
    const token = req.header('Authorization');
    if (!token || !token.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    // Verify token validity, signature, and expiration
    const decoded = jwt.verify(token.substring(7), JWT_SECRET);
  
    // Check if role inside token is 'Owner'
    if (decoded.role !== 'owner') {
      return res.status(401).json({ message: 'Unauthorized not an owner' });
    }
  
    // Check if userId is present in the Role db
    const role = await Role.findOne({ userId: decoded.userId });
    if (!role || role.role !== 'owner') {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    // Check if user is active
    if (!role.active) {
      return res.status(401).json({ message: 'User is not active' });
    }
    if (!role.verified) {
      return res.status(401).json({ message: 'verify your account' });
    }
  
    // Attach userId to the request object for further processing
    req.userId = decoded.userId;
  
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

const AdminAuthenticated = async (req, res, next) => {
  try {
    // Check if token is present
    const token = req.header('Authorization');
    if (!token || !token.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    // Verify token validity, signature, and expiration
    const decoded = jwt.verify(token.substring(7), JWT_SECRET);
  
    // Check if role inside token is 'Owner'
    if (decoded.role !== 'admin') {
      return res.status(401).json({ message: 'Unauthorized not an admin' });
    }
    
  
    // Check if userId is present in the Role db
    const role = await Role.findOne({ userId: decoded.userId });
    if (!role || role.role !== 'admin') {
      return res.status(401).json({ message: 'Unauthorizedddddddd' });
    }
  
    // Attach userId to the request object for further processing
    req.userId = decoded.userId;
  
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

const TenantAuthenticated = async (req, res, next) => {
    try {
      // Check if token is present
      const token = req.header('Authorization');
      if (!token || !token.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
    
      // Verify token validity, signature, and expiration
      const decoded = jwt.verify(token.substring(7), JWT_SECRET);
    
      // Check if role inside token is 'Owner'
      if (decoded.role !== 'tenant') {
        return res.status(401).json({ message: 'Unauthorized not an tenant' });
      }
      
    
      // Check if userId is present in the Role db
      const role = await Role.findOne({ userId: decoded.userId });
      if (!role || role.role !== 'tenant') {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      if (!role.active) {
        return res.status(401).json({ message: 'User is not active' });
      }
      if (!role.verified) {
        return res.status(401).json({ message: 'verify your account' });
      }
    
      // Attach userId to the request object for further processing
      req.userId = decoded.userId;
    
      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Unauthorized' });
    }
  };


  const OwnerOrTenantAuthenticated = async (req, res, next) => {
    try {
      // Check if token is present
      const token = req.header('Authorization');
      if (!token || !token.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
    
      // Verify token validity, signature, and expiration
      const decoded = jwt.verify(token.substring(7), JWT_SECRET);
    
      // Check if role inside token is 'Owner'
      if (decoded.role !== 'owner' && decoded.role !== 'tenant' ) {
        return res.status(401).json({ message: 'Unauthorized not an owner or not a tenant' });
      }
    
      // Check if userId is present in the Role db
      const role = await Role.findOne({ userId: decoded.userId });
      if (!role || role.role !== 'owner' && role.role !== 'tenant') {
        return res.status(401).json({ message: 'Unauthorizedddddddd' });
      }
    
      // Attach userId to the request object for further processing
      req.userId = decoded.userId;
    
      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Unauthorized' });
    }
  };
  
module.exports = {OwnerAuthenticated, TenantAuthenticated, AdminAuthenticated, OwnerOrTenantAuthenticated};
