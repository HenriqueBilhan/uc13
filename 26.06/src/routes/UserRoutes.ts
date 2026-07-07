import { UserController } from "../controller/UserController";
import { Router } from "express";

const controller = new UserController()
const router = Router()

router.get('/users', controller.getAll.bind(controller))
router.post("/users", controller.register.bind(controller));

export default router