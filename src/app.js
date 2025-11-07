require('dotenv').config();
require('express-async-errors');
const express = require('express');
const { create } = require('express-handlebars');
const path = require('path');
const methodOverride = require('method-override');
const connectDB = require('./config/db');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const User = require('./models/user');
const Idea = require('./models/idea');
const voteRoutes = require('./routes/voteRoutes');
const flash = require('express-flash')
const helmet = require('helmet');

// Middlewares personalizados
const setUser = require('./middlewares/setUserMiddleware');

const ideaRoutes = require('./routes/ideaRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.use(helmet());

// Conexão com MongoDB
connectDB();

// Middlewares básicos
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Sessões
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret123',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    dbName: 'dbIdeas'
  }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

app.use(flash());

app.use(setUser);

const hbs = create({
  extname: '.hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: path.join(__dirname, 'views/partials'),
  helpers: {
    ifeq: function(a, b, options) {
      if (a == b) return options.fn(this);
      return options.inverse(this);
    },
    ifIncludes: function(array, value, options) {
      if (Array.isArray(array) && array.includes(value)) {
        return options.fn(this);
      }
      return options.inverse(this);
    },
    unlessIncludes: function(array, value, options) {
      if (!Array.isArray(array) || !array.includes(value)) {
        return options.fn(this);
      }
      return options.inverse(this);
    },
    ifEquals(a, b, options) {
      return a === b ? options.fn(this) : options.inverse(this);
    },
    or() {
      return Array.prototype.slice.call(arguments, 0, -1).some(Boolean);
    },
    formatDate: (date) => {
    return new Date(date).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  }
});



app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

// Rotas
app.use('/', authRoutes);
app.use('/ideas', ideaRoutes);
app.use('/ideas/vote', voteRoutes);

// Página inicial
app.get('/', (req, res) => {
  res.redirect('/ideas');
});

function isAuthenticated(req, res, next) {
  if (req.session && req.session.userId) return next();
  return res.redirect('/login');
}

// Perfil
app.get('/profile', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).lean();
    const ideas = await Idea.find({ userId: req.session.userId }).lean();
    res.render('profile', { user, ideas });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao carregar perfil');
  }
});

// Inicializa servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
