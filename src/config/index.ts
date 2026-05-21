import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(process.cwd(), ".env") });

const config = {
    port: process.env.PORT,
    connection_stringDB: process.env.CONNECTION_STRING,
    secret:process.env.SECRET,
    expire :process.env.EXPIRE
}

export default config;