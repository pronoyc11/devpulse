import type { Request, Response } from "express";
import { getErrorMessage, sendResponse } from "../../utility/sendResponse";
import { issuesService } from "./issues.service";
import type { Query } from "../../types";


const createIssues = async (req: Request, res: Response) => {

    try {

        const result = await issuesService.createIssuesInDB(req.user?.id, req.body);


        sendResponse(res, {
            status: 201,
            success: true,
            message: "Issue created successfully",
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

const getAllIssues = async (req: Request, res: Response) => {


    try {
        const result = await issuesService.getAllIssuesFromDB(req.query as Query);




        return res.status(200).json({
            success: true,
            data: result
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

export const issuesController = {
    createIssues, getAllIssues
}