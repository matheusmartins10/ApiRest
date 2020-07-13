const db = require('../database/postgres');

module.exports = {
  async index(req, res) {
    try {
      const result = await db.query(`SELECT pedidos.id_pedido,
        pedidos.quantidade,
        produtos.id_produto,
        produtos.nome,
        produtos.preco
        FROM pedidos
        INNER JOIN produtos
        ON produtos.id_produto = pedidos.id_pedido;`, (error, results) => {
        if (error) {
          throw error;
        }

        const response = {
          quantidade: results.rows.length,
          pedidos: results.rows.map((pedido) => ({
            id_pedido: pedido.id_pedido,
            id_produto: pedido.id_produto,
            nome: pedido.nome,
            quantidade: pedido.quantidade,
          })),
        };
        return res.status(200).json({ dados: response });
      });
      return res.json(result);
    } catch (err) {
      return res.status(401).json({ message: err });
    }
  },

  async indexId(req, res) {
    const id = req.params.id_produto;

    if (id === 'especial') {
      return res.status(200).send({
        mensagem: 'Usando o get como produto exclusivo',
        id,
      });
    }
    return res.status(200).send({
      mensagem: 'vc passou um id',
    });
  },

  async create(req, res) {
    const pedido = {
      id_produto: req.body.id_produto,
      quantidade: req.body.quantidade,
    };

    return res.status(201).send({
      mensagem: 'Usando o post',
      pedidoCriado: pedido,
    });
  },

  async update(req, res) {
    return res.status(201).send({
      mensagem: 'Usando o patch',
    });
  },

  async delete(req, res) {
    return res.status(200).send({
      mensagem: 'Usando o delete',
    });
  },
};
