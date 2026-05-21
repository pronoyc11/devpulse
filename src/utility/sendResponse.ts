import type { Response } from "express";
import type { Tresponse } from "../types";




export const getErrorMessage = (error: unknown, errorMessage: string = "Something went wrong!") => {

    if (error instanceof Error) {
        return error.message;
    } else {
        return errorMessage;
    }
}

export const sendResponse = <T>(res: Response, data: Tresponse<T>) => {


    return res.status(data.status).json({
        success: data.success,
        message: data.message,
        data: data.data,
        errors: data.error
    })
}