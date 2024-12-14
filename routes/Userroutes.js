import { Router } from "express";
import { login,getme,signup } from "../functions/User.js";
import {Protecter} from "../config/middlewares.js"
const userRoutes=Router()

userRoutes.get("/",Protecter,getme)
userRoutes.post("/login",login)
userRoutes.post("/signup",signup)


export default userRoutes