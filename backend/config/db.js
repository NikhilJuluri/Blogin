import pg from "pg";

const Db = new pg.Pool({
  host : "localhost",
  port : 5432,
  user : "myuser",
  database : "mydb",
  password :"868829"
});

export default Db;
