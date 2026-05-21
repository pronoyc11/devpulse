import { pool } from "../../db";
import type { JwtPayload, Query } from "../../types";
import { USER_ROLES } from "../../utility/sendResponse";
import type { Tissues } from "./issues.interface";


const createIssuesInDB = async (id: string, payload: Tissues) => {

    const { title, description, type, status } = payload;

    const result = await pool.query(`
        INSERT INTO issues(title,description,type,status,reporter_id) 
        VALUES($1,$2,$3,COALESCE($4,'open'),$5) RETURNING *
        `, [title, description, type, status, id]);

    return result;


}

const getAllIssuesFromDB = async (allQuery: Query) => {

    const { sort = "newest", type, status } = allQuery;
    let query = `SELECT * FROM issues`;
    const conditions: string[] = [];
    const values: string[] = [];


    if (type) {
        values.push(type);
        conditions.push(`type = $${values.length}`);
    }

    if (status) {
        values.push(status);
        conditions.push(`status = $${values.length}`);
    }

    if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(" AND ")}`;
    }

    if (sort === "oldest") {
        query += ` ORDER BY created_at ASC`;
    } else {
        query += ` ORDER BY created_at DESC`;
    }

    const issuesResult = await pool.query(query, values);
    const issues = issuesResult.rows;

    const reporterIds = [
        ...new Set(issues.map((issue) => issue.reporter_id)),
    ];

    let reportersMap: Record<number, any> = {};
    if (reporterIds.length > 0) {
        const reportersResult = await pool.query(
            `SELECT id, name, role 
         FROM users 
         WHERE id = ANY($1)`,
            [reporterIds]
        );

        reportersMap = reportersResult.rows.reduce((acc, reporter) => {
            acc[reporter.id] = reporter;
            return acc;
        }, {} as Record<number, any>);
    }
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
        throw new Error("No issues reported yet")
    }
    return formattedIssues;



}

const getSingleIssueFromDB = async (id: string) => {
    const issueFound = await pool.query(`
        SELECT * FROM issues WHERE id = $1
        `, [id]);
    if (issueFound.rows.length === 0) {
        throw new Error("No issue is reported with this ID");
    }
    const issue = issueFound.rows[0];

    const reporterFound = await pool.query(`
            SELECT id,name,role from users WHERE id = $1
            `, [issue.id]);
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
            role: reporter.role
        },
        created_at: issue.created_at,
        updated_at: issue.updated_at
    }

    return finalIssue;

}

const updateSingleIssueInDB = async (id:string,user:JwtPayload)=>{
    
    const findIssue = await pool.query(`
        SELECT * FROM issues WHERE id=$1
        `,[id]);

        const issue = findIssue.rows[0];

    if(user.role === USER_ROLES.contributor){
       console.log("issue id:",id);
       console.log("user :",user);
      if(issue.reporter_id !== user.id){
        throw new Error("You can't update someone else's issue.");
      }
      if(issue.status !== "open"){
         throw new Error("This issue is resolved!");
      }

   }
}
export const issuesService = {
    createIssuesInDB, getAllIssuesFromDB, getSingleIssueFromDB,updateSingleIssueInDB
}