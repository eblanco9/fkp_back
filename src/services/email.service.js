import nodemailer from 'nodemailer';

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
    const transporter = await getTransporter(clientConfig);
    const info = await transporter.sendMail(mailOptions);
    console.log(`Correo enviado por ${clientConfig.auth.user}:`, info.messageId);
}