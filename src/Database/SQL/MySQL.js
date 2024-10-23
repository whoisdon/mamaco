import { MySQLDriver, QuickDB } from 'quick.db';
import 'dotenv/config';

const { HOST, USER, PASSWORD, DATABASE } = process.env;

const mysqlDriver = new MySQLDriver({
   host: HOST,
   user: USER,
   password: PASSWORD,
   database: DATABASE,
});

const connectToMySQL = async () => {
    await mysqlDriver.connect();
    const mysql = new QuickDB({ driver: mysqlDriver });

    return mysql;
}

export default connectToMySQL();
