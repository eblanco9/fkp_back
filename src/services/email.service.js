// services/email.service.js (o como lo llames)
import HttpError from '../errors/httpError.js';
import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend';

const mailerSend = new MailerSend({
    apiKey: process.env.MAILERSEND_API_KEY,
});

const sentFrom = new Sender("hurdo@mikasawor.com", "Hürdó di FKP");

const DEFAULT_FROM_EMAIL = "hurdo@mikasawor.com";

const approved_email_template = {
    subject: `Bo informashon a wòrdu verifiká ku éksito!`,
    text: `
Konta [Nombre], Danki pa aktualisá bo informashon ku Fundashon Kas Popular (FKP). 
Nos ta konfirmá ku bo informashon a keda verifiká ku éksito i ku awor bo ta partisipá na e sorteo eksklusivo pa hürdónan di FKP.
Nos lo tene bo informá tokante e próksimo aktualisashonnan i e ganadónan.
E sorteo lo ta dia 30 di desèmber pa 3:00 PM.
Premionan di e sorteo:

Promé premio
Gift Card di Mangusa Supermarket – XCG 2,500

Di dos premio
Gift Card di Building Depot – XCG 1,500

Di tres premio
Gift Card di Boolchand's – XCG 1,000
Un kordial saludo, 
Tim di FKP`
};

const rejected_email_template = {
    subject: `Nos mester pa bo revisá bo registrashon den Hürdónan FKP`,
    text: `
Konta [Nombre], Nos a detektá ku algun di e informashonnan ku bo a manda no ta kuadra ku loke nos tin registrá. 
Mensahe di Moderador: [mensaje_moderador]
Por fabor, bolbe subi e siguiente link i kompletá e aktualisashon korektamente: [link].
Danki pa boso kolaborashon. 
Un kordial saludo, 
Tim di FKP`
};

/**
 * ADAPTADOR
 * Este método mantiene el nombre y la firma del original (sendEmail(params))
 * pero en vez de mandarlo a SES lo convierte al formato de MailerSend.
 *
 * params esperado (como antes):
 * {
 *   Source: "info@...",
 *   Destination: { ToAddresses: ["mail@destino.com"] },
 *   Message: {
 *     Subject: { Data: "asunto" },
 *     Body: { Text: { Data: "cuerpo" } }
 *   }
 * }
 */
export const sendEmail = async (params) => {
    try {
        const toList = params?.Destination?.ToAddresses || [];
        if (!toList.length) {
            throw new Error("No hay destinatarios");
        }

        const recipients = toList.map((email) => new Recipient(email));

        const subject = params?.Message?.Subject?.Data || "Sin asunto";
        const text = params?.Message?.Body?.Text?.Data || "";

        const emailParams = new EmailParams()
            .setFrom(sentFrom)
            .setTo(recipients)
            .setSubject(subject)
            .setText(text)
            .setReplyTo(sentFrom);

        await mailerSend.email.send(emailParams);
        console.log("Correo enviado con MailerSend");
    } catch (error) {
        console.log(error);
        throw HttpError.conflict("Error al enviar el correo");
    }
};

// ====== estos dos métodos quedan con el MISMO NOMBRE que en tu service original ======

export const enviarEmailDeAprobacion = async (email, nombre) => {
    const texto = approved_email_template.text.replace('[Nombre]', nombre);

    const mailOptions = {
        Source: DEFAULT_FROM_EMAIL,
        Destination: { ToAddresses: [email] },
        Message: {
            Subject: { Data: approved_email_template.subject },
            Body: { Text: { Data: texto } },
        },
    };

    await sendEmail(mailOptions);
};

export const enviarEmailDeRechazo = async (email, nombre, mensaje_moderador) => {
    // si tenés el frontend en una env lo usás, si no, dejo un placeholder
    const frontendHost = process.env.FRONTEND_HOST || '';

    let text_a_enviar = rejected_email_template.text;
    text_a_enviar = text_a_enviar.replace('[Nombre]', nombre);
    text_a_enviar = text_a_enviar.replace('[link]', frontendHost);
    text_a_enviar = text_a_enviar.replace('[mensaje_moderador]', mensaje_moderador || '');

    const mailOptions = {
        Source: DEFAULT_FROM_EMAIL,
        Destination: { ToAddresses: [email] },
        Message: {
            Subject: { Data: rejected_email_template.subject },
            Body: { Text: { Data: text_a_enviar } },
        },
    };

    await sendEmail(mailOptions);
};
