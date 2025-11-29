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