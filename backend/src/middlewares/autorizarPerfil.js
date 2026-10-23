
function autorizarPerfil(perfilPermitido) {
  return (req, res, next) => {
    const usuario = req.usuario;

    if (!usuario) {
      return res.status(401).json({
        erro: "Usuário não autenticado.",
      });
    }

    const perfil = String(
      usuario.tipo || usuario.perfil || usuario.role || ""
    )
      .trim()
      .toLowerCase();

    if (perfil !== perfilPermitido.toLowerCase()) {
      return res.status(403).json({
        erro: "Você não tem permissão para realizar esta ação.",
      });
    }

    next();
  };
}

module.exports = autorizarPerfil;
