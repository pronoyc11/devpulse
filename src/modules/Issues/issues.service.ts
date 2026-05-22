import { pool } from "../../db";
import type { JwtPayload, Query } from "../../types";
import { USER_ROLES } from "../../utility/sendResponse";
import type { Tissues, TissuesFull } from "./issues.interface";

const createIssuesInDB = async (id: string, payload: Tissues) => {
    const { title, description, type, status } = payload;

    if (!title || !description || !type) {
        throw new Error("Provide all the required fields.")
    }
    //CHECK is already provided in the database,
    //This is added to prevent auto increment on failed query
    if (type !== 'bug' && type !== 'feature_request') {
        throw new Error("type can only be bug or feature_request");
    }
    const result = await pool.query(
        `
        INSERT INTO issues(title,description,type,status,reporter_id) 
        VALUES($1,$2,$3,COALESCE($4,'open'),$5) RETURNING *
        `,
        [title, description, type, status, id]
    );

    return result;
};

const getAllIssuesFromDB = async (allQuery: Query) => {
    const { sort = "newest", type, status } = allQuery;
    //BASE QUERY
    let query = `SELECT * FROM issues`;

    //SETTING UP ARRAYS TO STORE QUERY PARAMS AND CONDITIONAL TEXT FOR ADDING TO THE QUERY 
    const conditions: string[] = [];
    const values: string[] = [];

    if (type) {
        //SETTING UP VALUES AND QUERY CONDITIONS FOR type PARAM.
        values.push(type);
        conditions.push(`type = $${values.length}`);
    }

    if (status) {
        //SETTING UP VALUES AND QUERY CONDITIONS FOR status PARAM.
        values.push(status);
        conditions.push(`status = $${values.length}`);
    }

    if (conditions.length > 0) {
        //ADDING THE CONDITIONS TO THE QUERY
        query += ` WHERE ${conditions.join(" AND ")}`;
    }

    //FOR SHOWING THE NEWEST OF OLDEST
    if (sort === "oldest") {
        query += ` ORDER BY created_at ASC`;
    } else {
        query += ` ORDER BY created_at DESC`;
    }

    const issuesResult = await pool.query(query, values);
    const issues = issuesResult.rows;

    //RETRIEVING ALL THE REPORTER_IDS FROM issues AND AVOIDING DUPLICATES BY USING SET
    const reporterIds = [...new Set(issues.map((issue) => issue.reporter_id))];

    let reportersMap: Record<number, any> = {};
    if (reporterIds.length > 0) {

        //FINDING INDIVIDUAL REPORTER INFOS
        const reportersResult = await pool.query(
            `SELECT id, name, role 
         FROM users 
         WHERE id = ANY($1)`,
            [reporterIds]
        );
        //UPDATING THE REPORTER MAP WITH CORRESPONDING REPORTER INFOS
        reportersMap = reportersResult.rows.reduce((acc, reporter) => {
            acc[reporter.id] = reporter;
            return acc;
        }, {} as Record<number, any>);
    }

    //FINAL FORMATTED ISSUES
    const formattedIssues = issues.map((issue) => ({
        id: issue.id,
        title: issue.title,
        description: issue.description,
        type: issue.type,
        status: issue.status,
        reporter: reportersMap[issue.reporter_id],
        created_at: issue.created_at,
        updated_at: issue.updated_at,
    }));

    if (formattedIssues.length === 0) {
        throw new Error("No issues");
    }
    return formattedIssues;
};

const getSingleIssueFromDB = async (id: string) => {
    const issueFound = await pool.query(
        `
        SELECT * FROM issues WHERE id = $1
        `,
        [id]
    );
    if (issueFound.rows.length === 0) {
        throw new Error("No issue is reported with this ID");
    }
    const issue = issueFound.rows[0];

    const reporterFound = await pool.query(
        `
            SELECT id,name,role from users WHERE id = $1
            `,
        [issue.reporter_id]
    );
    if (reporterFound.rows.length === 0) {

        throw new Error("Reporter not found!");

    }
    const reporter = reporterFound.rows[0];

    const finalIssue = {
        id: issue.id,
        title: issue.title,
        description: issue.description,
        type: issue.type,
        status: issue.status,
        reporter: {
            id: reporter.id,
            name: reporter.name,
            role: reporter.role,
        },
        created_at: issue.created_at,
        updated_at: issue.updated_at,
    };

    return finalIssue;
};

const updateSingleIssueInDB = async (
    id: string,
    user: JwtPayload,
    payload: TissuesFull
) => {
    const findIssue = await pool.query(
        `
        SELECT * FROM issues WHERE id=$1
        `,
        [id]
    );
    if (findIssue.rows.length === 0) {
        throw new Error("No issues found on this id!");
    }
    const issue = findIssue.rows[0];
    const {
        title,
        description,
        type,
        status,
        created_at,
        updated_at,
    } = payload;
    if (user.role === USER_ROLES.contributor) {
        if (issue.reporter_id !== user.id) {
            throw new Error("You can't update someone else's issue.");
        }
        if (issue.status !== "open") {
            throw new Error("This issue is not open for interacting!");
        }
        const updateIssue = await pool.query(
            `
           UPDATE issues SET title = COALESCE($1,title),description=COALESCE($2,description),type=COALESCE($3,type) WHERE id=$4 RETURNING *
        `,
            [title, description, type, id]
        );
        return updateIssue;
    }

    if (user.role !== USER_ROLES.maintainer) {
        throw new Error("Invalid role");
    }
    const updateIssueByMaintainer = await pool.query(
        `
           UPDATE issues SET title = COALESCE($1,title),description=COALESCE($2,description),type=COALESCE($3,type),
              status=COALESCE($4,status),
        created_at=COALESCE($5,created_at),
        updated_at=COALESCE($6,updated_at)

        WHERE id=$7
           RETURNING *
        `,
        [title, description, type, status,
            created_at,
            updated_at, id]
    );
    return updateIssueByMaintainer;
};

const deleteSingleIssueInDB = async (id: string) => {
    const deletedIssue = await pool.query(`
    DELETE FROM issues WHERE id=$1 RETURNING *
    `, [id]);
    if (deletedIssue.rows.length === 0) {
        throw new Error("No issue to delete on this id");
    }
    return deletedIssue;
}

export const issuesService = {
    createIssuesInDB,
    getAllIssuesFromDB,
    getSingleIssueFromDB,
    updateSingleIssueInDB,
    deleteSingleIssueInDB
};
