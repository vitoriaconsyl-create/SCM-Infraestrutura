const express = require("express");
const cors = require("cors");

const ocorrenciaRoutes = require("./routes/ocorrenciaRoutes");
const relatorioRoutes = require("./routes/relatorioRoutes");
const usuarioRoutes = require("./routes/usuarioRoutes");
const authRoutes = require("./auth/authRoutes");
const pool = require("./database/database");
const notificacaoRoutes = require("./routes/notificacaoRoutes");

const app = express();

app.use(cors());
app.use(express.json({ limit: "8mb" }));

app.use("/api/auth", authRoutes);
app.use("/api/ocorrencias", ocorrenciaRoutes);
app.use("/api/relatorios", relatorioRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/notificacoes", notificacaoRoutes);

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});