const { body, validationResult } = require('express-validator');

const signupValidation = [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 12 }).withMessage('Password must be at least 12 characters')
                    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+}{"':;?/>.<,])(?!.*\s).*$/)
                    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    body('name').notEmpty().withMessage('Name is required'),
    body('phone').isMobilePhone().withMessage('Invalid phone number format'),
    body('roleName').notEmpty().withMessage('Role name is required'),
    body('selectedDate').isISO8601().withMessage('Invalid date format'),
    body('showDatePicker').isBoolean().withMessage('Invalid showDatePicker value'),
 
    
    (req, res, next) => {
      
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array()[0].msg });
        }
        next();
    }
];

module.exports = signupValidation;
