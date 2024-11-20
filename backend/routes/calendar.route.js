import express from 'express';
import { createCalendar, deleteCalendar, getCalendars, updateCalendar } from '../controllers/calendar.controller.js';

const router = express.Router();

router.get("/", getCalendars);
router.post("/", createCalendar);
router.put("/:id", updateCalendar);
router.delete("/:id", deleteCalendar);

export default router;