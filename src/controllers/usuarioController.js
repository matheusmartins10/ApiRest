const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../database/postgres');

module.exports = {
  async cadastro(req, res) {
    const { email } = req.body;
    await db.query('SELECT * FROM usuarios WHERE email = $1', [email], (err, result) => {
      if (err) { return res.status(401).json(err); }
      if (result.rows.length > 0) {
        res.status(400).json({ message: 'Usuário já cadastrado' });
      } else {
        bcrypt.hash(req.body.senha, 10, (errBcrypt, hash) => {
          if (errBcrypt) { return res.status(500).send({ error: errBcrypt }); }

          db.query('INSERT INTO usuarios (email, senha) VALUES ($1, $2) ', [email, hash], (error, results) => {
            if (error) { return res.status(500).json(error); }

            const response = {
              mensagem: 'Usuário criado com sucesso',
              userCreate: {
                id: results.rows.id_usuario,
                email,
              },
            };

            return res.status(201).json(response);
          });
        });
      }
    });
  },

  async login(req, res) {
    const { email, senha } = req.body;
    db.query('SELECT * FROM usuarios WHERE email = $1', [email], (error, results) => {
      if (error) {
        return res.status(500).json(error);
      }

      if (results.rows.length < 1) { return res.status(401).json({ message: 'Falha na autentificação' }); }
      bcrypt.compare(senha, results.rows[0].senha, (err, result) => {
        if (err) {
          return res.status(401).json({ message: 'Falha na autentificação' });
        }
        if (result) {
          const token = jwt.sign({
            id_usuario: results.rows[0].id_usuario,
            email: results.rows[0].email,
          },
          process.env.JWT_KEY,
          {
            expiresIn: '1h',
          });
          return res.status(200).json({ message: 'Autenticado com sucesso', token });
        }

        return res.status(401).json({ message: 'Falha na autentificação' });
      });
    });
  },
};
