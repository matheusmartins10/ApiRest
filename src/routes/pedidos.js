const express = require('express');

const routes = express.Router();

const pedidoController = require('../controllers/pedidoController');

routes.get('/', pedidoController.index);

routes.post('/', pedidoController.create);

routes.get('/:id_produto', pedidoController.indexId);

routes.patch('/', pedidoController.update);

routes.delete('/', pedidoController.delete);

module.exports = routes;
