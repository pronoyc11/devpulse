import { pool } from "../../db";
import type { Tuser } from "./auth.interface";

const signUpUserInDB = async (payload: Tuser) => {

    const { name, email, password, role } = payload;

    
    const result = await pool.query(`
            INSERT INTO users(name,email,password,role)  
            VALUES ($1,$2,$3,COALESCE($4,'contributor')) RETURNING *      
        `, [name, email, password, role]);
    
    delete result.rows[0].password;
    return result;
}

export const authService = {
    signUpUserInDB
}