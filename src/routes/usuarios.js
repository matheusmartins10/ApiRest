const express = require('express');

const routes = express.Router();

const usuarioController = require('../controllers/usuarioController');

routes.post('/cadastro', usuarioController.cadastro);

routes.post('/login', usuarioController.login);

module.exports = routes;
