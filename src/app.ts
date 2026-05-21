import express, { type Request, type Response } from "express";
import { authRouter } from "./modules/auth/auth.route";
import { issuesRouter } from "./modules/Issues/issues.route";
import { globalError } from "./middlewares/globalError";


const app = express();

//OTHER_MIDDLEWIRES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text());

//API_END_POINTS
app.get("/",(req:Request,res:Response)=>{
    res.status(200).json({
        message:"Hi, Welcome to ###DEVPULSE###."
    })
})
app.use("/api/auth", authRouter);
app.use("/api/issues", issuesRouter);


app.use(globalError);
export default app;