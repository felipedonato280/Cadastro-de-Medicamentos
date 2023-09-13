const { MongoClient } = require("mongodb");

class Database {
    singleton = null;

    static async #connect() {
        if (this.singleton) return this.singleton;

        const client = new MongoClient(process.env.MONGO_URL);
        await client.connect();

        const db = client.db(process.env.MONGO_DB);

        this.singleton = db;
        return db;
    }

    static async findOne(collection, filter) {
        const db = await this.#connect();

        return db.collection(collection).findOne(filter);
    }

    static async insertOne(collection, object) {
        const db = await this.#connect();

        return db.collection(collection).insertOne(object);
    }
}

module.exports = Database;