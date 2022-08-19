const path = require('path');
const csrf = require('csurf');
const flash = require('connect-flash');
const mongoose = require('mongoose')
const express = require('express');
const Handlebars = require('handlebars')
const exphbs = require('express-handlebars');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);

const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');

const homeRoutes = require('./routes/home');
const coursesRoutes = require('./routes/courses');
const addRoutes = require('./routes/add');
const cartRoutes = require('./routes/cart');
const ordersRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');

const varMidleware = require('./midleware/variables');
const userMidleware = require('./midleware/user');
const keys = require('./keys')


const PORT = process.env.PORT || 3000;

const app = express();

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    helpers: require('./utils/hbs-helpers')
});

const store = new MongoStore({
    collection: 'sessions',
    uri: keys.MONGODB_URI
})


app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');


app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store
}));

app.use(csrf());
app.use(flash());
app.use(varMidleware);
app.use(userMidleware);

app.use('/', homeRoutes);
app.use('/courses', coursesRoutes);
app.use('/add', addRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', ordersRoutes);
app.use('/auth', authRoutes);


async function start() {
    try {
        await mongoose.connect(keys.MONGODB_URI, { useNewUrlParser: true });
        app.listen(PORT, () => {
            console.log(`My server started on port ${PORT}`);
        })
    } catch (e) {
        console.log(e)
    }
}

start();