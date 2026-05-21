import type { Request, Response } from "express";
import { authService } from "./auth.service";
import { getErrorMessage, sendResponse } from "../../utility/sendResponse";




const signUpUser = async (req: Request, res: Response) => {

    try {

        const result = await authService.signUpUserInDB(req.body);


        sendResponse(res, {
            status: 201,
            success: true,
            message: "User created Successfully",
            data: result.rows[0]
        })
    } catch (error) {
        sendResponse(res, {
            status: 500,
            success: false,
            message: getErrorMessage(error),
            error: error
        })
    }
}


export const authController = {
    signUpUser
}