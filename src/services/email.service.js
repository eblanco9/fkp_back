import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import HttpError from '../errors/httpError.js';



const client = new SESClient({ 
    region: process.env.SES_REGION,
    credentials: {
        accessKeyId: process.env.SES_ACCESS_KEY_ID,
        secretAccessKey: process.env.SES_SECRET_ACCESS_KEY
    }
});

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
}

const rejected_email_template = {
    subject: `Necesitamos que revises tu registro en Inquilinos FKP `,
    text: `
    Hola [Nombre], Detectamos que algunos de los 
    datos que enviaste no coinciden con los que 
    tenemos registrados. 
    Mensaje del moderador: [mensaje_moderador]
    Por favor, ingresá nuevamente al siguiente enlace 
    y completa la actualización correctamente: [link].
    Gracias por tu colaboración. 
    Un cordial saludo, 
    Equipo de FKP`
}


export const sendEmail = async(params) => {
    try {
        console.log(params)
        console.log("intento enviar correo")
        const data = await client.send(new SendEmailCommand(params));
        console.log("Correo enviado:", data.MessageId);
    } catch (error) {
        console.log(error)
        throw HttpError.conflict("Error al enviar el correo");
    }
}

export const enviarEmailDeAprobacion = async (email, nombre) => {
    
    const mailOptions = {
        Source: "info@hurdo-fkp.com",
        Destination: { ToAddresses: [email] },
        Message: {
            Subject: { Data: approved_email_template.subject },
            Body: { Text: { Data: approved_email_template.text.replace('[Nombre]', nombre) } }
        },
    }

    await sendEmail(mailOptions)

}

export const enviarEmailDeRechazo = async (email, nombre, mensaje_moderador) => {
    let text_a_enviar = rejected_email_template.text
    text_a_enviar = text_a_enviar.replace('[Nombre]', nombre)
    text_a_enviar = text_a_enviar.replace('[link]', 'https://develop.d2k4hfb6ypo1ii.amplifyapp.com/') 
    text_a_enviar = text_a_enviar.replace('[mensaje_moderador]', mensaje_moderador) 

    const mailOptions = {
        Source: "info@hurdo-fkp.com",
        Destination: { ToAddresses: [email] },
        Message: {
            Subject: { Data: rejected_email_template.subject },
            Body: { Text: { Data: text_a_enviar } }
        },
    }
    await sendEmail(mailOptions)
}