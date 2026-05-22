import config from "../../config";
import { pool } from "../../db";
import type { JwtPayload } from "../../types";
import type { Tuser } from "./auth.interface";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { USER_ROLES } from "../../utility/sendResponse";

const signUpUserInDB = async (payload: Tuser) => {

    const { name, email, password, role } = payload;
    if (!name || !email || !password) {
        throw new Error("Provide all the required fields.")
    }
    const hashPass = await bcrypt.hash(password, 10);
    const userExist = await pool.query(`
        select * from users where email=$1
        `, [email]);
    if (userExist.rows.length > 0) {
        throw new Error("user already exists with this email!")
    }
    if (role && role != USER_ROLES.contributor && role != USER_ROLES.maintainer) {
        throw new Error("role must be either contributor or maintainer!");
    }
    const result = await pool.query(`
            INSERT INTO users(name,email,password,role)  
            VALUES ($1,$2,$3,COALESCE($4,'contributor')) RETURNING *      
        `, [name, email, hashPass, role]);

    delete result.rows[0].password;
    return result;
}
const logInUserInDB = async (payload: { email: string, password: string }) => {
    const { email, password } = payload;

    const findUser = await pool.query(`
        SELECT * FROM users WHERE email = $1
        `, [email]);

    if (findUser.rows.length == 0) {
        throw new Error("User not found!");
    }

    const passMatch = await bcrypt.compare(password, findUser.rows[0].password);

    if (!passMatch) {
        throw new Error("Password did not match!");
    }
    delete findUser.rows[0].password;
    const user = findUser.rows[0];
    const jwtPayload: JwtPayload = {
        id: user.id,
        name: user.name,
        role: user.role
    }
    const token = jwt.sign(jwtPayload, config.secret as string, { expiresIn: "1d" });

    return { token, user }
}
export const authService = {
    signUpUserInDB, logInUserInDB
}