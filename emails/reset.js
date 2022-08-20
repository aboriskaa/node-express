const keys = require('../keys/index')

module.exports = function (email, token) {
    return {
        to: email,
        from: keys.EMAIL_FROM,
        subject: 'Password recovery',
        html: `
        <h1>Have you forgotten your password?</h1>
        <p>
        </hr>
        If didn't forget your password, please ignore this email!</p>
        <p>
        Otherwise, follow the link:</p>
        <p><a href="${keys.BASE_URL}/auth/password/${token}">Password recovery</a></p>
        `
    }
}