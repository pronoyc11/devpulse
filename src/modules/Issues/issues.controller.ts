import type { Request, Response } from "express";
import { getErrorMessage, sendResponse } from "../../utility/sendResponse";
import { issuesService } from "./issues.service";
import type { JwtPayload, Query } from "../../types";


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
            status: 400,
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
             message: "Issues retrived successfully",
             data: result
            })
    } catch (error) {
        sendResponse(res, {
            status: 400,
            success: false,
            message: getErrorMessage(error),
            error: error
        })
    }
    
}

const getSingleIssue = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        const result = await issuesService.getSingleIssueFromDB(id as string)
        return res.status(200).json({
            success: true,
            message: "Issue retrived successfully",
            data: result
        })
    } catch (error) {
        sendResponse(res, {
            status: 400,
            success: false,
            message: getErrorMessage(error),
            error: error
        })
    }
}

const updateSingleIssue = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await issuesService.updateSingleIssueInDB(id as string, req.user as JwtPayload, req.body);

        sendResponse(res, {
            status: 200,
            success: true,
            message: "Issue updated successfully",
            data: result.rows[0]
        })

    } catch (error) {
        sendResponse(res, {
            status: 400,
            success: false,
            message: getErrorMessage(error),
            error: error
        })
    }
}

const deleteSingleIssue = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const result = await issuesService.deleteSingleIssueInDB(id as string);
        sendResponse(res, {
            status: 200,
            success: true,
            message: "Issue deleted successfully",
        })

    } catch (error) {
        sendResponse(res, {
            status: 400,
            success: false,
            message: getErrorMessage(error),
            error: error
        })
    }
}
export const issuesController = {
    createIssues, getAllIssues, getSingleIssue, updateSingleIssue, deleteSingleIssue
}