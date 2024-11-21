import express from 'express';
import { createTodo, deleteTodo, getTodos, updateTodo } from '../controllers/todo.controller.js';
import { connectDB } from './utils/db.js';
import ServerlessHttp from 'serverless-http';
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors({ origin: true }));
connectDB();

app.get("/", getTodos);
app.post("/", createTodo);
app.put("/:id", updateTodo);
app.delete("/:id", deleteTodo);

export default ServerlessHttp(app);