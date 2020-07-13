const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const { token } = req.body;
    const decode = jwt.verify(token, process.env.JWT_KEY);
    req.usuario = decode;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Não autenticado' });
  }
};
