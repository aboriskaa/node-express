const path = require('path');
const mongoose = require('mongoose')
const express = require('express');
const Handlebars = require('handlebars')
const exphbs = require('express-handlebars');
const session = require('express-session');


const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');

const homeRoutes = require('./routes/home');
const coursesRoutes = require('./routes/courses');
const addRoutes = require('./routes/add');
const cartRoutes = require('./routes/cart');
const ordersRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');

const User = require('./models/user');
const varMidleware = require('./midleware/variables');

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


app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'some secret value',
    resave: false,
    saveUninitialized: false
}));

app.use(varMidleware);

app.use('/', homeRoutes);
app.use('/courses', coursesRoutes);
app.use('/add', addRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', ordersRoutes);
app.use('/auth', authRoutes);


async function start() {
    try {
        const url = "mongodb+srv://boris:uwz8lfXbx6NIhXtx@cluster0.byvu1.mongodb.net/shop"
        await mongoose.connect(url, { useNewUrlParser: true });

        // const candidate = await User.findOne()
        // if (!candidate) {
        //     const user = new User({
        //         email: '9600929@gmail.com',
        //         name: 'Boris',
        //         cart: { items: [] }
        //     })
        //     await user.save()
        // }

        app.listen(PORT, () => {
            console.log(`My server strated on port ${PORT}`);
        })
    } catch (e) {
        console.log(e)
    }
}

start();