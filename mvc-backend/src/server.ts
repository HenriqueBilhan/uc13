import express, { Application } from "express";
import userRoutes from "./routes/UserRoutes";

const app: Application = express();
const PORT = 3000;

app.use(express.json());
app.use(userRoutes);

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});