const Database = require("./modelBanco.js");

class Medicamento {
    constructor({ nome, descricao, indicacao, modo_usar, efeitos_colaterais }) {
        this.nome = nome;
        this.descricao = descricao;
        this.indicacao = indicacao;
        this.modo_usar = modo_usar;
        this.efeitos_colaterais = efeitos_colaterais;
    }

    async salvar() {
        const medicamento = {
            nome: this.nome,
            descricao: this.descricao,
            indicacao: this.indicacao,
            modo_usar: this.modo_usar,
            efeitos_colaterais: this.efeitos_colaterais,
        };

        const result = await Database.insertOne("medicamentos", medicamento);
        return result.insertedId;
    }

    static async listarTodos() {
        const medicamentos = await Database.findOne("medicamentos", {});
        return medicamentos;
    }
}

module.exports = Medicamento;
