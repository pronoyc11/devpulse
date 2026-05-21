import type { NextFunction, Request, Response } from "express";

export const globalError = (err: unknown, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof Error) {
        res.status(500).json({
            success: false,
            message: err.message,
        })
    } else {
        res.status(500).json({
            success: false,
            message: "Something went wrong!",
        })
    }
}