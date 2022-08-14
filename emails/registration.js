const keys = require('../keys')

module.exports = function (email) {
    return {
        to: email,
        from: keys.EMAIL_FROM,
        subject: 'Registration was successful',
        html: `
        <h1>You are welcome to the our store</h1>
        <p>
        You have successfully created an account!</p>
        </hr>
        <a href="${keys.BASE_URL}">Our store</a>
        `
    }
}