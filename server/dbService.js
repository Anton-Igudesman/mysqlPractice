const mysql = require('mysql');
require('dotenv').config();
const { HOST, USERNAME, PASSWORD, DATABASE, DB_PORT } = process.env;
let instance = null;

const connection = mysql.createConnection({
    host: HOST,
    user: USERNAME,
    password: PASSWORD,
    database: DATABASE,
    port: DB_PORT
});

connection.connect(err => {
    if (err) console.log(err.message);
    console.log(`db ${connection.state}`);
});

class DBService {
    static getDbServiceInstance() {
        return instance ? instance : new DBService();
    }

    async getAllData() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM user_info;";
                connection.query(query, (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result);
                })
            });

            //console.log('this is the response: ', response);
            return response;

        } catch (error) {
            console.log(error);
        }
    }

    async insertNewName(name) {
        try {
            const dateAdded = new Date();
            const insertId = await new Promise((resolve, reject) => {
                const query = "INSERT INTO user_info (name, date_added) VALUES (?, ?);";
                connection.query(query, [name, dateAdded], (err, result) => {
                    if (err) reject(new Error(err.message));
                    console.log('this is the result: ', result);
                    resolve(result.insertId);
                })
            });
            console.log(insertId);

            //console.log('this is the response: ', response);
            return {
                id: insertId,
                name,
                dateAdded
            };
        } catch (error) {
            console.log(error)
        }
    }

    async deleteRowById(id) {
        try {
            id = parseInt(id, 10);

            const response = await new Promise((resolve, reject) => {
                const query = "DELETE FROM user_info WHERE id = ?;";
                connection.query(query, [id], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            });
            console.log(response);
            return response === 1 ? true : false;

        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async updateNameById(id, name) {
        try {
            id = parseInt(id, 10);
            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE user_info SET name = ? WHERE id = ?;";
                connection.query(query, [name, id], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            });
            console.log(response);
            return response === 1 ? true : false;
        } catch (err) {
            console.log(err);
        }
    }

    async searchByName(name) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM user_info WHERE name = ?;";
                connection.query(query, [name], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result);
                })
            });

            console.log('this is the response: ', response);
            return response;

        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = DBService;

