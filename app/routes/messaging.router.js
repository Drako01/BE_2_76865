import { Router } from "express";
import { messagingController as ctrl } from "../controllers/messaging.controller.js";

const router = Router();

router.post('/api/messaging/sms', (req, res) => ctrl.sendSMS(req, res));
router.post('/api/messaging/whatsapp', (req, res) => ctrl.sendWhatsApp(req, res));

export default router;