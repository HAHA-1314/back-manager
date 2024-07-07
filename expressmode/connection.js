import mysql from 'mysql2';

const connection = mysql.createConnection({
  //connection 接收连接
  host: "localhost",
  port: "3306",
  user: "root",
  password: "951753",
  // database: "Local instance MySQL84",
});

connection.connect(error => {
    if (error) {
      console.log("error in MYSQL");
      throw error;
    }
});

// module.exports = connection;
export default connection;//