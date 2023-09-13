const Usuario = require("../models/modelUsuario");

async function entrarConta(req, res) {
    const nome = req.body.username;
    const senha = req.body.password;

    if (!nome || !senha) {
        return res.redirect("back");
    }

    const user = await Usuario.login(nome, senha);
    console.log(user);
    if (user) {
        req.session.user = user;
        return res.redirect("/home");
    }

    return res.redirect("/login");
}

async function criarConta(req, res) {
    const nome = req.body.username;
    const email = req.body.email;
    const senha = req.body.password;

    if (!nome || !email || !senha) return res.redirect("back");

    await Usuario.cadastro(nome, email, senha);

    const user = await Usuario.login(nome, senha);
    req.session.user = user;

    return res.redirect("/login"); // Redirecionar para a página de login
}

module.exports = { entrarConta, criarConta };
