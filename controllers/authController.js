require("dotenv").config();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { authenticateUser } = require("../middleware/authentication");

async function hashPassword(plainPassword) {
  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);

    // Hash the password using the generated salt
    const hashedPassword = await bcrypt.hash(plainPassword, salt);

    return hashedPassword;
  } catch (error) {
    console.error(error);
  }
}

async function comparePasswords(plainPassword, hashedPassword) {
  try {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);

    return isMatch;
  } catch (error) {
    console.error(error);
  }
}

const register = async (req, res) => {
  const { name, email, password, telefone, address } = req.body;
  const hashedPassword = await hashPassword(password);

  try {
    // Create a new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      telefone,
      address,
    });
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const isMatch = await comparePasswords(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    user.token = token;
    await user.save();
    res.json({ Valid: isMatch, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const logout = async (req, res) => {
  try {
    // Extrai o token do cabeçalho da solicitação
    const token = req.headers.authorization;

    // Verifica se o token é válido e se está dentro do período de expiração
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (token !== user.token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Invalida o token do usuário no banco de dados
    user.token = null;
    await user.save();

    // Retorna uma resposta de sucesso
    return res.status(200).json({ message: "User successfully logged out" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  register,
  login,
  logout,
};
