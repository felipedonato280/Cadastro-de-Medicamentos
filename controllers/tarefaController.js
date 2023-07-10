const Tarefa = require('../models/tarefaModel'); 

let tarefas = [];

async function getTarefas(req, res) { 
    tarefas = await Tarefa.listarTarefa();
    res.render('tarefas', { tarefas }); 
}

async function addTarefa(req, res) { 
    const { title } = req.body; 
        const tarefa = new Tarefa(null, title, null); 
        await tarefa.salvar();
    res.redirect('/tarefas'); 
}

module.exports = { getTarefas, addTarefa, };
