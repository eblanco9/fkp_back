// services/email.service.js (o como lo llames)
import HttpError from '../errors/httpError.js';
import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend';

const mailerSend = new MailerSend({
    apiKey: process.env.MAILERSEND_API_KEY,
});

const sentFrom = new Sender("hurdo@mikasawor.com", "Hürdó di FKP");

const DEFAULT_FROM_EMAIL = "hurdo@mikasawor.com";

const approved_email_template = {
    subject: `¡Tus datos fueron verificados correctamente!`,
    text: `
Hola [Nombre], Gracias por actualizar tu información con 
Fundashon Kas Popular (FKP). 
Confirmamos que tus datos fueron verificados con éxito y 
que ya estás participando en los sorteos exclusivos para 
inquilinos FKP.
Te mantendremos informado/a sobre las próximas 
novedades y los ganadores. 
Un cordial saludo, 
Equipo de FKP`
};

const rejected_email_template = {
    subject: `Necesitamos que revises tu registro en Inquilinos FKP`,
    text: `
Hola [Nombre], detectamos que algunos de los 
datos que enviaste no coinciden con los que 
tenemos registrados. 
Mensaje del moderador: [mensaje_moderador]
Por favor, ingresá nuevamente al siguiente enlace 
y completa la actualización correctamente: [link].
Gracias por tu colaboración. 
Un cordial saludo, 
Equipo de FKP`
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
