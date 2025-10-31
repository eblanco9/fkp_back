import nodemailer from 'nodemailer';
import HttpError from '../errors/httpError.js';

const cuentaEmail = {
    host_email: process.env.HOST_EMAIL,
    user_email: process.env.USER_EMAIL,
    pass_email: process.env.PASS_EMAIL
}

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

const transporterCache = new Map();

async function getTransporter(clientConfig) {
    const cacheKey = clientConfig.auth.user;

    if (transporterCache.has(cacheKey)) {
        return transporterCache.get(cacheKey);
    }

    const transporter = nodemailer.createTransport(clientConfig);

    try {
        await transporter.verify(); // Verifica conexión SMTP y credenciales
        transporterCache.set(cacheKey, transporter);
        return transporter;
    } catch (err) {
        console.error(`Error al verificar el transporter de ${clientConfig.auth.user}:`, err.message);
        throw new Error('Configuración SMTP inválida');
    }
}

export async function sendEmail(clientConfig, mailOptions) {
    try {
        const transporter = await getTransporter(clientConfig);
        const info = await transporter.sendMail(mailOptions);
        console.log(`Correo enviado por ${clientConfig.auth.user}:`, info.messageId)
    } catch (error) {
        console.log(error)
        throw HttpError.conflict("Error al enviar el correo");
    }
   ;
}

export const setConfigEmail = (cuentaEmail) => {
    const configEmail = {
        host: cuentaEmail.host_email,
        port: 587,
        secure: false,
        auth: {
            user: cuentaEmail.user_email,
            pass: cuentaEmail.pass_email
        },
        // // solo para pruebas, quitarlo para prod
        tls: {
            rejectUnauthorized: false
        }
    }
    return configEmail
}

export const enviarEmailDeAprobacion = async (email, nombre) => {
    const clientConfig = setConfigEmail(cuentaEmail)
    const mailOptions = {
        from: cuentaEmail.user_email,
        to: email,
        subject: approved_email_template.subject,
        text: approved_email_template.text.replace('[Nombre]', nombre)
    }
    await sendEmail(clientConfig, mailOptions)
}

export const enviarEmailDeRechazo = async (email, nombre, mensaje_moderador) => {
    const clientConfig = setConfigEmail(cuentaEmail)
    let text_a_enviar = rejected_email_template.text
    text_a_enviar = text_a_enviar.replace('[Nombre]', nombre)
    text_a_enviar = text_a_enviar.replace('[link]', 'link de rechazo') 
    text_a_enviar = text_a_enviar.replace('[mensaje_moderador]', mensaje_moderador) 
    const mailOptions = {
        from: cuentaEmail.user_email,
        to: email,
        subject: rejected_email_template.subject,
        text: text_a_enviar
    }
    await sendEmail(clientConfig, mailOptions)
}