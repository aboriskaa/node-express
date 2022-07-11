const path = require('path');
const mongoose = require('mongoose')
const express = require('express');
const exphbs = require('express-handlebars');
const homeRoutes = require('./routes/home');
const coursesRoutes = require('./routes/courses');
const addRoutes = require('./routes/add');
const cardRoutes = require('./routes/card');

const PORT = process.env.PORT || 3000;

const app = express();

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
});


app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }))

app.use('/', homeRoutes);
app.use('/courses', coursesRoutes);
app.use('/add', addRoutes);
app.use('/card', cardRoutes);

async function start() {
    try {
        const url = "mongodb+srv://boris:uwz8lfXbx6NIhXtx@cluster0.byvu1.mongodb.net/?retryWrites=true&w=majority"
        await mongoose.connect(url, { useNewUrlParser: true });
        app.listen(PORT, () => {
            console.log(`My server strated on port ${PORT}`);
        })
    } catch (e) {
        console.log(e)
    }
}

start();

