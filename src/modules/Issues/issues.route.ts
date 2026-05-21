import express, { type Request, type Response } from "express";
import { issuesController } from "./issues.controller";
import { authenticate } from "../../middlewares/authenticate.middleware";
import { USER_ROLES } from "../../utility/sendResponse";


const router = express.Router();

router.post("/", authenticate(USER_ROLES.contributor, USER_ROLES.maintainer), issuesController.createIssues);
router.get("/", issuesController.getAllIssues);
router.get("/:id", issuesController.getSingleIssue);
router.patch("/:id",authenticate(USER_ROLES.contributor, USER_ROLES.maintainer),issuesController.updateSingleIssue);
export const issuesRouter = router;