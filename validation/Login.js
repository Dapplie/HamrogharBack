const { body, validationResult } = require('express-validator');

const loginValidation = [
    body('email').optional().isEmail().withMessage('Invalid email address'),
    body('phone').optional().isMobilePhone().withMessage('Invalid phone number format'),
    
    body('password').isLength({ min: 12 }).withMessage('Password must be at least 12 characters')
                    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+}{"':;?/>.<,])(?!.*\s).*$/)
                    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = loginValidation;
