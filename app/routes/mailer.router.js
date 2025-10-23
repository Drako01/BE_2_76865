import { Router } from "express";
import { mailerController as ctrl } from '../controllers/mailer.controller.js';

const router = Router();

router.post('/api/mail/welcome', (req, res) => ctrl.sendWelcome(req, res));
router.post('/api/mail/order-status', (req, res) => ctrl.sendOrderTemplate(req, res));

export default router;