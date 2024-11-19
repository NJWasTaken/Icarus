import express from 'express';
import { deleteAccount, createAccount, getAccounts, updateAccount } from '../controllers/account.controller.js';

const router = express.Router();

router.get("/", getAccounts);
router.post("/", createAccount);
router.put("/:id", updateAccount);
router.delete("/:id", deleteAccount);

export default router;