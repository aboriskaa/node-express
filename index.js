const path = require('path');
const mongoose = require('mongoose')
const express = require('express');

const Handlebars = require('handlebars')
const exphbs = require('express-handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');

const homeRoutes = require('./routes/home');
const coursesRoutes = require('./routes/courses');
const addRoutes = require('./routes/add');
const cardRoutes = require('./routes/card');

const User = require('./models/user')


const PORT = process.env.PORT || 3000;

const app = express();

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
});


app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(async (req, res, next) => {
    try {
        const user = await User.findById('62d18eb8db2c8c39e1cb2230');
        req.user = user;
        next();
    } catch (e) {
        console.log(e)
    }
})


app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }))

app.use('/', homeRoutes);
app.use('/courses', coursesRoutes);
app.use('/add', addRoutes);
app.use('/card', cardRoutes);

async function start() {
    try {
        const url = "mongodb+srv://boris:uwz8lfXbx6NIhXtx@cluster0.byvu1.mongodb.net/shop"
        await mongoose.connect(url, { useNewUrlParser: true });

        const candidate = await User.findOne()
        if (!candidate) {
            const user = new User({
                email: '9600929@gmail.com',
                name: 'Boris',
                cart: { items: [] }
            })
            await user.save()
        }

        app.listen(PORT, () => {
            console.log(`My server strated on port ${PORT}`);
        })
    } catch (e) {
        console.log(e)
    }
}

start();