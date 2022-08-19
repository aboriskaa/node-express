const { body } = require('express-validator/check');

exports.registerValidators = [
    body('email').isEmail().withMessage('Enter correct E-mail!'),
    body('password', 'Password must be min 6 chars! ').isLength({ min: 6, max: 56 }).isAlphanumeric(),
    body('confirm').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords must be the same');
        }
        return true;
    }),
    body('name').isLength({ min: 3, max: 56 }).withMessage('Name must be min 3 chars!')
]