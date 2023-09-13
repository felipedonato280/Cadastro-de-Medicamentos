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

app.listen(PORT, () => console.log("Rodando na porta " + PORT));