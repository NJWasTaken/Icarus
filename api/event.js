import express from 'express';
import { createEvent, deleteEvent, getEvents, updateEvent } from '../controllers/event.controller.js';
import ServerlessHttp from 'serverless-http';
import { connectDB } from './utils/db.js';
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors({ origin: true }));
connectDB();

app.get("/", getEvents);
app.post("/", createEvent);
app.put("/:id", updateEvent);
app.delete("/:id", deleteEvent);

export default ServerlessHttp(app);
