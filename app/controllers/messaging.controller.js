import { messagingService } from "../services/messaging.service.js";

class MessagingController {
    async sendSMS(req, res) {
        try{
            const { to, body } = req.body;
            const r = await messagingService.sendSMS({to, body});
            res.status(200).json({ok: true, ...r});
        } catch(err) {res.status(400).json({ok: false, error: err.message}); }
    }

    async sendWhatsApp(req, res) {
        try{
            const { to, body } = req.body;
            const r = await messagingService.sendWhatsApp({to, body});
            res.status(200).json({ok: true, ...r});
        } catch(err) {res.status(400).json({ok: false, error: err.message}); }
    }
}

export const messagignController = new MessagingController();
