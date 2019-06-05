const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const keys = require('./config/keys');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const exphbs = require('express-handlebars');

//require user model
require('./models/User');

//pass config
require('./config/passport')(passport);

// load routes
const auth = require('./routes/auth');
const index = require('./routes/index');

//fixing a warning
mongoose.Promise = global.Promise;
//mongoose connect
mongoose.connect(keys.mongoURI)
    .then(() => {console.log('connected to MongoDB')})
    .catch((err) => console.log(err));

const app = express();

//handlebars
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.use(cookieParser());
app.use(session({
    secret: 'secret123',
    resave: false,
    saveUninitialized: false
}))

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//set global variables
app.use((req,res,next) => {
    res.locals.user = req.user || null;
    next();
});

//using routes
app.use('/', index);
app.use('/auth', auth)

//port for dev and prod
const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log('Listening...')
});