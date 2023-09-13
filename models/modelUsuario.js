const md5 = require("md5");
const modelBanco = require("./modelBanco.js");

class Usuario {
    constructor(username, email, senha) {
        this.username = username;
        this.email = email;
        this.password = senha;
    }

    static async login(nome, senha) {
        return await modelBanco.findOne("usuarios", { username: nome, password: md5(senha) });
    }

    static async cadastro(nome, email, senha) {
        return await modelBanco.insertOne("usuarios", new Usuario(nome, email, md5(senha)));
    }
}

module.exports = Usuario;