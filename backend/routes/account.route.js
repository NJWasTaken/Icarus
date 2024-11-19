import express from 'express';
import { deleteAccount, createAccount, getAccounts, updateAccount, login, register } from '../controllers/account.controller.js';

const router = express.Router();

router.get("/", getAccounts);
router.post("/", createAccount);
router.put("/:id", updateAccount);
router.delete("/:id", deleteAccount);
router.post("/login", login);
router.post("/register", register);
export default router;