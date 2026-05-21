import type { Request, Response } from "express";
import { getErrorMessage, sendResponse } from "../../utility/sendResponse";
import { issuesService } from "./issues.service";


const createIssues = async (req: Request, res: Response) => {

    try {
        console.log("issuesController", req.user);
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

export const issuesController = {
    createIssues
}