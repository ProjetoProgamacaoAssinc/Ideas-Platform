const mongoose = require('mongoose');

module.exports = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'dbIdeas',
    });
    console.log('✅ Conectado ao MongoDB com sucesso!');
  } catch (err) {
    console.error('❌ Erro ao conectar ao MongoDB:', err);
    process.exit(1);
  }
};
