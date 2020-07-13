const express = require('express');

const routes = express.Router();

const multer = require('multer');
const login = require('../middleware/login');

const produtoController = require('../controllers/produtoController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage, limits: { fileSize: 1024 * 1024 * 5 }, fileFilter });

routes.get('/', produtoController.index);

routes.get('/:id', produtoController.indexID);

routes.post('/', upload.single('produto_imagem'), login, produtoController.create);

routes.patch('/:id', produtoController.uptade);

routes.delete('/:id', produtoController.delete);

module.exports = routes;
