# 📚 Documentação da Aplicação — Projeto de Ideias 💾

## Documentação do Banco de Dados (DB)

## 🧩 Visão Geral
O banco de dados do projeto foi projetado utilizando **MongoDB** com **Mongoose**, adotando uma estrutura relacional baseada em referências (`ref`) para garantir integridade e escalabilidade.  
Ele armazena **usuários**, **ideias** e **votos**, assegurando regras de unicidade, contagem de votos e vínculo entre entidades.

---

## ⚙️ Configuração Inicial

### Instalação
```bash
npm install mongoose
```
```bash
npm install express-async-errors
```
```bash
npm install express-flash 
```
```bash
npm install helmet 
```
Crie um arquivo `.env` com a variável de conexão:
```bash
MONGODB_URI=mongodb://localhost:27017/ideias
```
No arquivo `app.js`, conecte-se ao banco:
```js
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Conectado ao MongoDB'))
  .catch(err => console.error('❌ Erro ao conectar:', err));
```

---

## 🧱 Modelagem de Dados

### 👤 User
Representa os usuários do sistema.

```js
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
```

### 💡 Ideia
Cada ideia é criada por um usuário autenticado.

```js
const ideiaSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descricao: { type: String, required: true },
  autor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Ideia', ideiaSchema);
```

### 🗳️ Voto
Garante que cada usuário possa votar apenas uma vez em cada ideia.

```js
const votoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ideaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ideia', required: true }
}, { timestamps: true });

// Índice único composto (garante voto único por ideia)
votoSchema.index({ userId: 1, ideaId: 1 }, { unique: true });

module.exports = mongoose.model('Voto', votoSchema);
```

---

## 📊 Recursos Avançados — Fase de Excelência (Nota 10)

### 🔒 Integridade dos Votos
Com o índice composto `{ userId, ideaId }`, o próprio MongoDB bloqueia votos duplicados, garantindo consistência transacional.

### 📈 Contagem e Ordenação via Aggregation Pipeline
Cálculo dos votos e ordenação das ideias por popularidade:
```js
const Ideia = require('./models/Ideia');
const Voto = require('./models/Voto');

async function listarIdeiasOrdenadas() {
  return await Ideia.aggregate([
    {
      $lookup: {
        from: 'votos',
        localField: '_id',
        foreignField: 'ideaId',
        as: 'votos'
      }
    },
    {
      $addFields: { totalVotos: { $size: '$votos' } }
    },
    { $sort: { totalVotos: -1, createdAt: -1 } }
  ]);
}
```

### 👤 Filtragem por Usuário (View de Perfil)
Retorna apenas as ideias do usuário logado:
```js
async function ideiasDoUsuario(userId) {
  return await Ideia.find({ autor: userId }).populate('autor', 'nome email');
}
```

---

## 🧭 Boas Práticas e Segurança

- ✅ Sempre utilize **try/catch** para manipulação segura das operações do banco.
- ⚙️ Prefira funções **assíncronas** com `async/await` para evitar bloqueios.
- 🔒 Aplique **validações de esquema** rigorosas (`required`, `unique`).
- 🧩 Use `mongoose.set('strictQuery', true)` para evitar consultas inseguras.
- 🧠 Mantenha os Schemas isolados na pasta `/models` e nomeados em PascalCase.

---

## 🧾 Tabela de Entidades

| Entidade | Campos Principais | Relacionamentos | Regras de Integridade |
|-----------|------------------|------------------|------------------------|
| **User** | nome, email, senha | - | email único, senha hash |
| **Ideia** | título, descrição, autor | autor → User | autor obrigatório |
| **Voto** | userId, ideaId | userId → User, ideaId → Ideia | índice único `{userId, ideaId}` |

---

## 🧮 Diagrama ER Simplificado

```text
[User] 1 ────< [Ideia] 1 ────< [Voto]
   |                  ^
   └──────────────────┘
```

---

## ✅ Checklist de Implementação do DB

- [x] Instalar e configurar Mongoose  
- [x] Criar modelos `User`, `Ideia` e `Voto`  
- [x] Implementar índice composto em `Voto`  
- [x] Testar agregação para contagem e ordenação  
- [x] Criar função para listar ideias do usuário logado  
- [x] Documentar ER e boas práticas no README

---

📦 **Status:** Banco de Dados Pronto para Integração com Backend  
🧠 **Responsável:** *EDUARDO TOLEDO*

# 📚 Documentação da Aplicação — Projeto de Ideias 💾

## Documentação do Front

## Documentação do Back
