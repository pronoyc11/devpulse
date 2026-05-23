import { Pool } from "pg";
import config from "../config";


export const pool = new Pool({
    connectionString: config.connection_stringDB
})

export const connectDB = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users(
              id SERIAL PRIMARY KEY,
              name VARCHAR(20) NOT NULL,
              email VARCHAR(20) UNIQUE NOT NULL,
              password TEXT NOT NULL,
              role VARCHAR(20) DEFAULT 'contributor',
              created_at TIMESTAMP DEFAULT NOW(),
              updated_at TIMESTAMP DEFAULT NOW(),
              CHECK( role = 'contributor' OR role = 'maintainer')
            )
            `);
        await pool.query(`
        CREATE TABLE IF NOT EXISTS issues(
        id SERIAL PRIMARY KEY,
        title VARCHAR(150) NOT NULL,
        description TEXT NOT NULL,
        type VARCHAR(20) NOT NULL,
        status VARCHAR(20) DEFAULT 'open',
        reporter_id INT REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        CHECK(type = 'bug' OR type = 'feature_request'),
        CHECK(status='open' OR status = 'in_progress' OR status= 'resolved')
        )
        `)

        console.log("Database connected successfully.");
    } catch (error: any) {
        console.log(error);
        throw new Error(error);
    }
}