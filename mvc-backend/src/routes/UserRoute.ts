import { Router } from "express";
import { UserController } from "../controllers/UserController";

const router = Router();
const controller = new UserController();

router.get("/users", (req, res) => controller.listAllUsers(req, res));
router.post("/users", (req, res) => controller.createUser(req, res));
router.put("/users/:id", (req, res) => controller.updateUser(req, res));
router.delete("/users/:id", (req, res) => controller.deleteUser(req, res));

export default router;