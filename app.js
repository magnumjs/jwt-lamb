const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "defaultsecret";

app.post("/login", (req, res) => {
  const { username } = req.body;
  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
});

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).send("Missing token");
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).send("Invalid token");
  }
};

app.get("/protected", authMiddleware, (req, res) => {
  res.json({ message: "This is protected data", user: req.user });
});

app.get("/", (req, res) => {
  res.send("Hello from Express running on Lambda Function URL!");
});

module.exports = app;
