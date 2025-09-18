import { Router } from "express";
import { mailerController } from "../app/controllers/mailer.controller.js";

const router = Router();

router.post('/api/mail/welcome', (req, res) => mailerController.sendWelcome(req, res));
router.post('/api/mail/order-status', (req, res) => mailerController.sendorderStatus(req, res));


export default router;