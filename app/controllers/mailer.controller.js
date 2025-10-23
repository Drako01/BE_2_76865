import { mailerService as svc } from '../services/mailer.service.js';

class MailerController {
    async sendWelcome(req, res) {
        try{
            const { to, name } = req.body;
            const r = await svc.send({
                to,
                subject: `Bienvenido/a ${name || "Usuario"}!`,
                template: 'welcome',
                context: { name: name || "Usuario"},
            })
            res.status(200).json({ ok: true, ...r});
        } catch(err) {res.status(400).json({error: err.message})};
    }

    async sendOrderTemplate(req, res) {
        try{
            const { to, code, status } = rq.body;
            const r = await svc.send({
                to,
                subject: `Actualizacion de tu orden ${code}`,
                template: 'order-status',
                context: { code, status },
            })
            res.status(200).json({ ok: true, ...r});
        } catch(err) {res.status(400).json({error: err.message})};
    }
}

export const mailerController = new MailerController();
