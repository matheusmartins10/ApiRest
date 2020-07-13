const db = require('../database/postgres');

module.exports = {
  async index(req, res) {
    await db.query('SELECT * FROM produtos', (error, results) => {
      if (error) {
        return res.status(500).json({
          message: `Not exists ${error}`,
        });
      }

      const produtoCreate = results.rows.map((prod) => ({
        id: prod.id_produto,
        nome: prod.nome,
        preco: prod.preco,
        imagem_produto: `http://localhost:3000/${prod.imagem_produto}`,
        request: {
          type: 'GET',
          url: `http://localhost:3000/produtos/${prod.id_produto}`,
        },
      }));
      return res.status(200).json(produtoCreate);
    });
  },

  async indexID(req, res) {
    const { id } = req.params;

    await db.query('SELECT * FROM produtos WHERE id_produto = $1', [id], (error, results) => {
      if (error) {
        throw error;
      }

      const response = {
        produto: {
          nome: results.rows[0].nome,
          preco: results.rows[0].preco,
          imagem: `http://localhost:3000/${results.rows[0].imagem_produto}`,

          request: {
            type: 'GET',
          },
        },
      };

      return res.status(200).json(response);
    });
  },

  async create(req, res) {
    const { nome, preco } = req.body;
    const imagem = req.file.path;

    await db.query('INSERT INTO produtos (nome, preco, imagem_produto) VALUES ($1, $2, $3) ', [nome, preco, imagem], (error, results) => {
      if (error) {
        throw error;
      }

      return res.status(201).send('Product add on database');
    });
  },

  async uptade(req, res) {
    const { id } = req.params;

    const { nome, preco } = req.body;

    await db.query('UPDATE produtos SET nome = $1, preco = $2 WHERE  id_produto = $3', [nome, preco, id], (error, results) => {
      if (error) {
        throw error;
      }

      return res.status(200).send(`Product is modified with id  = ${id}`);
    });
  },

  async delete(req, res) {
    const { id } = req.params;

    await db.query('DELETE FROM produtos WHERE id_produto = $1', [id], (error, results) => {
      if (error) {
        throw error;
      }
      return res.status(200).send(`User deleted with ID: ${id}`);
    });
  },
};
