import nodemailer from 'nodemailer';
import fs from 'fs/promises';
import path from 'path';
import Handlebars from 'handlebars';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_SECURE,
    SMTP_USER,
    SMTP_PASS,
    SMTP_FROM
} = process.env;

function buildTransport() {
    if(!SMTP_HOST) throw new Error("Host no definido!!");
    return nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT || 587),
        secure: String(SMTP_SECURE || "false") === "true",
        auth: { user: SMTP_USER, pass: SMTP_PASS},
    });
}


async function renderTemplate(templateName, data){
    const viewDir = path.join(__dirname, '../views/emails');
    const filePath = path.join(viewDir, `${templateName}.handlebars`);
    const source = await fs.readFile(filePath, 'utf-8');
    const tpl = Handlebars.compile(source);
    return tpl(data || {});
}

export class MailerService {
    async send({to, subject, template, context = {}}){
        if(!to || !subject || !template) throw new Error("Faltan campos obligatorios");
        const transport = buildTransport();
        const html = await renderTemplate(template, context);
        const info = await transport.sendMail({
            from: SMTP_FROM || SMTP_USER,
            to,
            subject,
            html,
        })

        return { messageId: info.messageId, accepted: info.accepted, rejected: info.rejected };
    }
}

export const mailerService = new MailerService();
