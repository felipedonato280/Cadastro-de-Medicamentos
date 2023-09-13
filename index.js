require("dotenv").config();

const express = require("express");
const session = require("express-session");
const expressEjsLayouts = require("express-ejs-layouts");
const { MongoClient } = require("mongodb");

const app = express();
const PORT = process.env.PORT || 3000;

function autenticar(req, res, next) {
    if (req.originalUrl === "/login" || req.originalUrl === "/cadastro") {
        next();
    } else if (req.session.user) {
        res.locals.user = req.session.user;
        next();
    } else res.redirect("/login");
}

const controllerUsuario = require("./controllers/controllerUsuario");
const controllerMedicamento = require("./controllers/controllerMedicamento");

app.set("view engine", "ejs");
app.set("layout", "./layouts/index");
app.use(expressEjsLayouts);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: process.env.SECRET }));
app.use(autenticar);

app.get("/home", async (req, res) => {

    let client;

    try {

        client = new MongoClient(process.env.MONGO_URL);
        await client.connect();

        const db = client.db(process.env.MONGO_DB);
        const medicamentosCollection = db.collection("medicamentos");

        const medicamentos = await medicamentosCollection.find({}).toArray();

        res.render("viewHome", { medicamentos });
    } catch (error) {
        console.error("Erro ao buscar medicamentos:", error);
        res.status(500).send("Erro ao buscar medicamentos");
    } finally {
        if (client) {
            client.close();
        }
    }
});

app.get("/cadastrar-medicamento", (req, res) => res.render("viewCadastroMedicamento"));

app.post("/cadastrar-medicamento", controllerMedicamento.cadastrarMedicamento);

app.get("/login", (req, res) => res.render("viewLogin"));

app.post("/login", controllerUsuario.entrarConta);

app.get("/cadastro", (req, res) => res.render("viewCadastro"));

app.post("/cadastro", controllerUsuario.criarConta);

const { ObjectId } = require("mongodb");

app.get("/excluir-medicamento/:id", async (req, res) => {
    const medicamentoId = req.params.id;

    if (!ObjectId.isValid(medicamentoId)) {
        return res.status(400).send("ID de medicamento inválido.");
    }

    let client;

    try {
        client = new MongoClient(process.env.MONGO_URL);
        await client.connect();

        const db = client.db(process.env.MONGO_DB);
        const medicamentosCollection = db.collection("medicamentos");
        const objectId = new ObjectId(medicamentoId);

        await medicamentosCollection.deleteOne({ _id: objectId });

        console.log("Medicamento excluído com sucesso!");
        res.redirect("/home");
    } catch (error) {
        console.error("Erro ao excluir medicamento:", error);
        res.status(500).send("Erro ao excluir medicamento");
    } finally {
        if (client) {
            client.close();
        }
    }
});

app.get("/editar-medicamento/:id", async (req, res) => {
    const medicamentoId = req.params.id;

    // Verifique se o ID é válido
    if (!ObjectId.isValid(medicamentoId)) {
        return res.status(400).send("ID de medicamento inválido.");
    }

    let client;

    try {
        client = new MongoClient(process.env.MONGO_URL);
        await client.connect();

        const db = client.db(process.env.MONGO_DB);
        const medicamentosCollection = db.collection("medicamentos");

        // Encontre o medicamento com base no ID
        const medicamento = await medicamentosCollection.findOne({ _id: new ObjectId(medicamentoId) }); // Use 'new' para criar o ObjectId

        if (!medicamento) {
            return res.status(404).send("Medicamento não encontrado.");
        }

        res.render("viewEditarMedicamento", { medicamento }); // Renderize a página de edição com os dados do medicamento
    } catch (error) {
        console.error("Erro ao buscar medicamento para edição:", error);
        res.status(500).send("Erro ao buscar medicamento para edição");
    } finally {
        if (client) {
            client.close();
        }
    }
});

app.post("/editar-medicamento/:id", async (req, res) => {
    const medicamentoId = req.params.id;

    // Verifique se o ID é válido
    if (!ObjectId.isValid(medicamentoId)) {
        return res.status(400).send("ID de medicamento inválido.");
    }

    const { nome, descricao, indicacao, modo_usar, efeitos_colaterais } = req.body;

    let client;

    try {
        client = new MongoClient(process.env.MONGO_URL);
        await client.connect();

        const db = client.db(process.env.MONGO_DB);
        const medicamentosCollection = db.collection("medicamentos");

        await medicamentosCollection.updateOne(
            { _id: ObjectId(medicamentoId) },
            {
                $set: {
                    nome,
                    descricao,
                    indicacao,
                    modo_usar,
                    efeitos_colaterais,
                },
            }
        );

        console.log("Medicamento editado com sucesso!");
        res.redirect("/home");
    } catch (error) {
        console.error("Erro ao editar medicamento:", error);
        res.status(500).send("Erro ao editar medicamento");
    } finally {
        if (client) {
            client.close();
        }
    }
});


app.listen(PORT, () => console.log("Rodando na porta " + PORT));