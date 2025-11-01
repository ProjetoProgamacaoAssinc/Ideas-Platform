const express = require('express');
const { create } = require('express-handlebars');
const path = require('path');
const methodOverride = require('method-override');

const app = express();
const PORT = 3000;

const hbs = create({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials'),
    helpers: {
        ifeq: function (a, b, options) {
            return (a == b) ? options.fn(this) : options.inverse(this);
        }
    }
});

app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

const mockUser = {
    _id: 'user123',
    name: 'Nicolas Nicodem',
    email: 'nicolas.nicodem@jbf.com.br'
};

const mockIdeas = [
    { _id: 'idea1', title: 'Gamificação no Treinamento', description: 'Usar jogos para treinar novos funcionários.', category: 'RH', votes: { length: 15 }, author: 'user123' },
    { _id: 'idea2', title: 'App de Caronas Corporativo', description: 'Um app para organizar caronas entre os colaboradores.', category: 'Tecnologia', votes: { length: 8 }, author: 'user456' },
    { _id: 'idea3', title: 'Otimização da Linha de Produção X', description: 'Implementar sensor Y para reduzir desperdício.', category: 'Processos', votes: { length: 5 }, author: 'user123' }
];

app.get('/', (req, res) => {
    res.render('index', {
        title: 'Ideias em Destaque',
        ideas: mockIdeas  
    });
});

app.get('/home-logado', (req, res) => {
    res.render('index', {
        title: 'Ideias em Destaque',
        ideas: mockIdeas,
        user: mockUser 
    });
});

app.get('/login', (req, res) => {
    res.render('login');
});
app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/ideas/new', (req, res) => {
    res.render('idea_form', {
        user: mockUser  
    });
});

app.get('/ideas/edit/:id', (req, res) => {
    res.render('idea_form', {
        user: mockUser,
        idea: mockIdeas[0] 
    });
});

app.get('/ideas/:id', (req, res) => {
    const ideaToShow = mockIdeas[0];
    
    res.render('idea_detail', {
        user: mockUser, 
        idea: ideaToShow,
        isAuthor: ideaToShow.author === mockUser._id, 
        userHasVoted: false 
    });
});

app.get('/profile', (req, res) => {
    const userIdeas = mockIdeas.filter(idea => idea.author === mockUser._id);
    
    res.render('profile', {
        user: mockUser,
        ideas: userIdeas
    });
});

app.post('/login', (req, res) => { res.redirect('/home-logado'); });
app.post('/register', (req, res) => { res.redirect('/login'); });
app.post('/ideas', (req, res) => { res.redirect('/home-logado'); });

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});