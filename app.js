const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const keys = require('./config/keys');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

//require user model
require('./models/User');
require('./models/Post')

//pass config
require('./config/passport')(passport);

// load routes
const auth = require('./routes/auth');
const index = require('./routes/index');
const posts = require('./routes/posts');

// helpers
const {
    truncate,
    stripTags,
    formatDate,
    select,
    editBtn
} = require('./helpers/hbs');

//fixing a warning
mongoose.Promise = global.Promise;
//mongoose connect
mongoose.connect(keys.mongoURI)
    .then(() => {console.log('connected to MongoDB')})
    .catch((err) => console.log(err));

const app = express();

//body parser;
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// method override
app.use(methodOverride('_method'));

//handlebars
app.engine('handlebars', exphbs({
    helpers: {
        truncate,
        stripTags,
        formatDate,
        select,
        editBtn
    },
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

//set static folder
app.use(express.static(path.join(__dirname, 'public')));

//using routes
app.use('/', index);
app.use('/auth', auth);
app.use('/posts', posts);


//port for dev and prod
const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log('Listening...')
});