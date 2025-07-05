const AuthService = require('../services/auth.service');
const UserDTO = require('../dtos/user.dto');

exports.register = async (req, res) => {
  try {
    const user = await AuthService.register(req.body);
    res.status(201).json(new UserDTO(user));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await AuthService.login(email, password);
    res.json({ user: new UserDTO(user), token });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};
