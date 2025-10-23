import twilio from 'twilio';

const {
    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN,
    TWILIO_FROM_SMS,
    TWILIO_FROM_WAPP
} = process.env;

const client = (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN)
                ? twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
                : null;


export class MessaginsService {
    #client;
    constructor(twilioClient = client ) { this.#client = twilioClient }
    #assert() { if(!this.#client ) throw new Error("Twilio no Configurado (.env)"); }


    async sendSMS({to, body}) {
        this.#assert();
        if(!to || !body ) throw new Error("Faltan campos to o body");
        if(!TWILIO_FROM_SMS) throw new Error("TWILIO_FROM_SMS no configurado");
        const m = await this.#client.messages.create({from: TWILIO_FROM_SMS, to, body});
        return {sid: m.sid, status: m.status };
    }

    async sendWhatsApp({to, body}){
        this.#assert();
        if(!to || !body ) throw new Error("Faltan campos obligatorios");
        if(!TWILIO_FROM_WAPP) throw new Error("El numero de referencia no esta configurado");
        const m = await this.#client.messages.create({from: TWILIO_FROM_WAPP, to, body});
        return { sid: m.sid, ststus: m.status};
    }

}

export const messagingService = new MessaginsService();
