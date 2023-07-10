const mysql = require("mysql2/promise");

async function connect() {
  try {
    if (global.connection && global.connection.state !== "disconnected")
      return global.connection;

    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      database: "aulamvc",
    });

    console.log("Você está conectado ao MySQL");
    global.connection = connection;

    return connection;
  } catch (error) {
    console.error("Erro ao conectar ao MySQL:", error);
    throw error;
  }
}

async function query(sql) {
  try {
    const conn = await connect();
    const [rows] = await conn.query(sql);
    return rows;
  } catch (error) {
    console.error("Erro ao executar a consulta:", error);
    throw error;
  }
}

module.exports = { query };