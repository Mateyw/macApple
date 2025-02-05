const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "ticket_system"
});

// Connect to MySQL
connection.connect((err) => {
    if (err) {
        console.error("Connection failed: " + err.message);
        return;
    }
    console.log("Connected to MySQL database successfully!");
});

module.exports = connection;
