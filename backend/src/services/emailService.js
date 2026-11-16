
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
    }
});

const enviarEmailRecuperacao = async (email, link) => {
    await transporter.sendMail({
        from: `"SCM-Infraestrutura" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Recuperação de senha - SCM-Infraestrutura",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
                <h2>Recuperação de senha</h2>

                <p>Recebemos uma solicitação para redefinir a senha da sua conta no SCM-Infraestrutura.</p>

                <p>Clique no botão abaixo para cadastrar uma nova senha:</p>

                <a href="${link}"
                   style="display: inline-block; padding: 12px 20px;
                   background-color: #2563eb; color: white;
                   text-decoration: none; border-radius: 5px;">
                    Redefinir minha senha
                </a>

                <p>Este link é válido por 30 minutos e poderá ser utilizado apenas uma vez.</p>

                <p>Se você não solicitou a recuperação, ignore este e-mail.</p>

                <p>Atenciosamente,<br>Equipe SCM-Infraestrutura</p>
            </div>
        `
    });
};

module.exports = {
    enviarEmailRecuperacao
};
