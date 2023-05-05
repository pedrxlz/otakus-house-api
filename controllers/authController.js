require("dotenv").config();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { authenticateUser } = require("../middleware/authentication");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

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

const forgetPassword = async (req, res) => {
  const { email, telefone } = req.body;

  try {
    // Verifica se o e-mail corresponde a um usuário registrado
    const user = await User.findOne({ $or: [{ email }, { telefone }] });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Gera um token aleatório e salva no registro do usuário
    const token = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // token expira em 1 hora
    await user.save();

    // Envia um e-mail para o usuário com o link para redefinição de senha
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_ADDRESS,
      to: user.email,
      subject: "Link para redefinição de senha",
      text:
        "Você está recebendo este e-mail porque solicitou a redefinição de senha para sua conta.\n\n" +
        "Por favor, clique no link a seguir ou cole-o no seu navegador para concluir o processo:\n\n" +
        `http://localhost:3000/reset/${token}\n\n` +
        "Se você não solicitou isso, ignore este e-mail e sua senha permanecerá inalterada.\n",
    };

    transporter.sendMail(mailOptions, (error, response) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
      } else {
        console.log("Email sent");
        console.log(token);
      }

      transporter.close();
    });

    res.json({
      message: "Link para redefinição de senha enviado para o seu e-mail",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const resetPassword = async (req, res) => {};

module.exports = {
  register,
  login,
  logout,
  forgetPassword,
  resetPassword,
};
