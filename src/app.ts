import express from "express";
import { authRouter } from "./modules/auth/auth.route";
import { issuesRouter } from "./modules/Issues/issues.route";


const app = express();

//OTHER_MIDDLEWIRES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text());

//API_END_POINTS
app.use("/api/auth", authRouter);
app.use("/api/issues", issuesRouter);


export default app;