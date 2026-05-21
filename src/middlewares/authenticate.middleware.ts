import type { NextFunction, Request, Response } from "express"
import type { JwtPayload, ROLES } from "../types";
import { sendResponse } from "../utility/sendResponse";
import jwt from "jsonwebtoken";
import config from "../config";
import { pool } from "../db";

export const authenticate = (...roles: ROLES[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization;

            if (!token) {
                sendResponse(res, {
                    status: 400,
                    success: false,
                    message: "invalid access",
                })
            }

            const verified = jwt.verify(token as string, config.secret as string) as JwtPayload;



            const userFound = await pool.query(`
                 SELECT * FROM users WHERE id = $1
                `, [verified.id]);


            if (userFound.rows.length == 0) {
                sendResponse(res, {
                    status: 404,
                    success: false,
                    message: "User is not found!",
                });
            }
            if (!roles.includes(userFound.rows[0].role)) {
                sendResponse(res, {
                    status: 403,
                    success: false,
                    message: "Access denied",
                });
            }
            const assignUser = {
                id: userFound.rows[0].id,
                name: userFound.rows[0].name,
                email: userFound.rows[0].email,
                role: userFound.rows[0].role
            }

            req.user = assignUser;

            next();

        } catch (error) {
            next(error);
        }
    }
}