const bcrypt = require('bcrypt');
const User = require('../models/user');

// Mostrar formulário de login
exports.showLogin = (req, res) => {
  res.render('auth/login');
};


exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.render('auth/login', { error: 'Usuário não encontrado' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render('auth/login', { error: 'Senha incorreta' });
    }

    // 🔥 Salva o usuário na sessão
    req.session.userId = user._id;
    req.session.user = { _id: user._id, name: user.name, email: user.email };

    // ✅ Aguarda salvar a sessão antes de redirecionar
    req.session.save((err) => {
      if (err) console.error('Erro ao salvar sessão:', err);
      res.redirect('/ideas');
    });
  } catch (err) {
    console.error(err);
    res.render('auth/login', { error: 'Erro no login. Tente novamente.' });
  }
};


// Mostrar formulário de registro
exports.showRegister = (req, res) => {
  res.render('auth/register');
};

// Fazer registro
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render('auth/register', { error: 'Usuário já cadastrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    await newUser.save();
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    res.render('auth/register', { error: 'Erro ao registrar usuário' });
  }
};

// Logout
exports.logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) console.error(err);
    res.redirect('/login');
  });
};
