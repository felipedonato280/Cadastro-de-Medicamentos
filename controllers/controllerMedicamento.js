const Medicamento = require("../models/modelMedicamento.js");

const cadastrarMedicamento = async (req, res) => {
    try {
        const { nome, descricao, indicacao, modo_usar, efeitos_colaterais } = req.body;

        const medicamentoData = {
            nome,
            descricao,
            indicacao,
            modo_usar,
            efeitos_colaterais,
        };

        const medicamento = new Medicamento(medicamentoData);
        const medicamentoId = await medicamento.salvar();
        console.log("Medicamento cadastrado com sucesso!");
        res.redirect("/home");
    } catch (error) {
        console.error("Erro ao cadastrar o medicamento:", error);
        res.status(500).send("Erro ao cadastrar o medicamento");
    }
};

module.exports = {
    cadastrarMedicamento,
};
