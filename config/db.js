const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Your MySQL username
    password: 'BlessedDaughter100.', // Your MySQL password
    database: 'TelemedicineDB'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL Database');
});

module.exports = db;
