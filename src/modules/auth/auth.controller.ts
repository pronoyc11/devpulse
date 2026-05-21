import type { Request, Response } from "express";




const signUpUser = async (req: Request, res: Response) => {

    res.status(200).json({
        success:true,
        message:"I'm working well!"
    })
}


export const authController = {
    signUpUser
}