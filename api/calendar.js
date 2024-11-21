import express from 'express';
import { createCalendar, deleteCalendar, getCalendars, updateCalendar } from '../controllers/calendar.controller.js';
import { connectDB } from './utils/db.js';
import ServerlessHttp from 'serverless-http';
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors({ origin: true }));
connectDB();

app.get("/", getCalendars);
app.post("/", createCalendar);
app.put("/:id", updateCalendar);
app.delete("/:id", deleteCalendar);

export default ServerlessHttp(app);