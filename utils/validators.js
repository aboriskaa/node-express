const { body } = require('express-validator/check');
const User = require('../models/user')
exports.registerValidators = [
    body('email')
        .isEmail()
        .withMessage('Enter correct E-mail!')
        .custom(async (value, { req }) => {
            try {
                const user = await User.findOne({ email: value });
                if (user) {
                    return Promise.reject('Email already exist!');
                }
            } catch (e) {
                console.log(e)
            }
        })
        .normalizeEmail(),
    body('password', 'Password must be min 6 chars! ')
        .isLength({ min: 6, max: 56 })
        .isAlphanumeric()
        .trim(),
    body('confirm')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords must be the same');
            }
            return true;
        })
        .trim(),
    body('name')
        .isLength({ min: 3, max: 56 })
        .withMessage('Name must be min 3 chars!')
        .trim()
]


exports.courseValidator = [
    body('title').isLength({ min: 3 }).withMessage('Title must have 3 chars min!'),
    body('price').isNumeric().withMessage('Enter correct price'),
    body('img', 'Enter correct url').isURL()
]