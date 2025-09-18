import { Router } from "express";
import { messagignController } from "../app/controllers/messaging.controller.js";

const router = Router();

router.post('/api/messaging/sms', (req, res) => messagignController.sendSMS(req, res));
router.post('/api/messaging/whatsapp', (req, res) => messagignController.sendWhatsApp(req, res));


export default router;