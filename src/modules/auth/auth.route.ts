import express from "express";
import { authController } from "./auth.controller";


const router = express.Router();

router.post("/signup", authController.signUpUser);



export const authRouter = router;