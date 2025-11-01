const User = require('../models/user');

module.exports = async function setUser(req, res, next) {
  if (req.session.userId) {
    try {
      const user = await User.findById(req.session.userId).lean();
      req.user = user; // torna disponível pro controller
      res.locals.user = user; // torna disponível pro Handlebars
    } catch (err) {
      console.error('Erro ao buscar usuário da sessão:', err);
    }
  } else {
    req.user = null;
    res.locals.user = null;
  }
  next();
};
