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
Konta [Nombre],

Danki pa aktualisá bo informashon ku Fundashon Kas Popular (FKP). Nos ta konfirmá ku bo informashon a keda verifiká ku éksito.

Tambe, si bo ta interesá den kumpra e kas ku bo ta hür, nos ta kompartí e pasonan pa sigui den e programa “Kumpra kas di Gobièrnu ku bo ta hür”.

Barionan ku tin kas disponibel pa bende inmediatamente ku nan A.B. , i ku ta e kasnan disponibel pa benta den kuadro di e prome faseta di e programa aki ta situá den e siguiente barionan:

• Koraalspecht • Brievengat • Seru Domi • Mundo Nobo • Jandoret • De Savaan Bieu • Dominguito • Nieuw Nederland • Mari Pampoen • Steenrijk • Vredenberg • Cher-Asile • Saliña • Kintjan

Importante: Si bo kas ta den un otro bario, e no ta kualifiká ahinda pa benta i kompra. Korda ku Gobierno a indiká ku nan ke bende tur nan kasnan, pa e motibu aki por favor indiká bo interes di kompra.

Dokumentashon Rekerí 

A. Dokumentonan 
    • Personal Buki di matrimonio, sertifikado di registro sivil (volledige uitreksel), òf  buki di famia.
    • Sédula/ Reibeweis òf pasaporte vigente 
B. Sertifikashon di Kadaster
    • Karta di Kadaster ku ta bisa ku bo no ta doño di ningun otro propiedat (E dokumento aki ta wòrdu optené serka Kadaster: https://share.google/lSDzpRVU1pBVMWz92)
C. Prueba di Entrada (Si bo ta kasá, dokumentonan di entrada di tur dos persona ta 
nesesario) 
    • Último dos estadonan di kuenta di banko.
    • Karta di trabou.
    • Prueba salarial di e último dos lunanan.
    • Saldo di fiansa na banko òf otro instituto (si ta aplikabel) 
D. Si bo ta traha pa bo mes:
    • Deklarashon di Inspekshon di Impuesto indikando entrada di e último 2 añanan.
    • Inskripshon na Kámara di Komèrsio (Kamer van Koophandel) 


Siguiente paso:

Na momentu ku bo tin tur e dokumentashon, por fabor aneksá esakinan na bo kontesta riba e e-mail aki: hurdo@mikasawor.com i mand’é pa nos.

Nos tim lo hasi un revishon i si e wòrdu aprobá, bo por traha un sita ku FKP pa sigui ku e proseso.

Si bo tin kualke pregunta, bo por manda un e-mail aki: hurdo@mikasawor.com

Saludo,
Ekipo di FKP`
    ,
    html: `
   <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="und">
    <head>
        <meta charset="UTF-8">
        <meta content="width=device-width, initial-scale=1" name="viewport">
        <meta name="x-apple-disable-message-reformatting">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta content="telephone=no" name="format-detection">
        <title>Empty template</title>
        <!--[if (mso 16)]><style type="text/css"> a {text-decoration: none;}  </style><![endif]-->
        <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]-->
        <!--[if gte mso 9]><noscript> <xml> <o:OfficeDocumentSettings> <o:AllowPNG></o:AllowPNG> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings> </xml> </noscript>
<![endif]-->
        <!--[if mso]><xml> <w:WordDocument xmlns:w="urn:schemas-microsoft-com:office:word"> <w:DontUseAdvancedTypographyReadingMail/> </w:WordDocument> </xml>
<![endif]-->
        <style type="text/css">
            .rollover:hover .rollover-first {
                max-height: 0px!important;
                display: none!important;
            }

            .rollover:hover .rollover-second {
                max-height: none!important;
                display: block!important;
            }

            .rollover span {
                font-size: 0px;
            }

            u + .body img ~ div div {
                display: none;
            }

            #outlook a {
                padding: 0;
            }

            span.MsoHyperlink,span.MsoHyperlinkFollowed {
                color: inherit;
                mso-style-priority: 99;
            }

            a.es-button {
                mso-style-priority: 100!important;
                text-decoration: none!important;
            }

            a[x-apple-data-detectors],#MessageViewBody a {
                color: inherit!important;
                text-decoration: none!important;
                font-size: inherit!important;
                font-family: inherit!important;
                font-weight: inherit!important;
                line-height: inherit!important;
            }

            .es-desk-hidden {
                display: none;
                float: left;
                overflow: hidden;
                width: 0;
                max-height: 0;
                line-height: 0;
                mso-hide: all;
            }

            @media only screen and (max-width: 600px) {
                .es-m-p20b {
                    padding-bottom:20px!important
                }

                .es-p-default {
                }

                *[class="gmail-fix"] {
                    display: none!important
                }

                p, a {
                    line-height: 150%!important
                }

                h1, h1 a {
                    line-height: 120%!important
                }

                h2, h2 a {
                    line-height: 120%!important
                }

                h3, h3 a {
                    line-height: 120%!important
                }

                h4, h4 a {
                    line-height: 120%!important
                }

                h5, h5 a {
                    line-height: 120%!important
                }

                h6, h6 a {
                    line-height: 120%!important
                }

                .es-header-body p {
                }

                .es-content-body p {
                }

                .es-footer-body p {
                }

                .es-infoblock p {
                }

                h1 {
                    font-size: 40px!important;
                    text-align: left
                }

                h2 {
                    font-size: 32px!important;
                    text-align: left
                }

                h3 {
                    font-size: 28px!important;
                    text-align: left
                }

                h4 {
                    font-size: 24px!important;
                    text-align: left
                }

                h5 {
                    font-size: 20px!important;
                    text-align: left
                }

                h6 {
                    font-size: 16px!important;
                    text-align: left
                }

                .es-header-body h1 a, .es-content-body h1 a, .es-footer-body h1 a {
                    font-size: 40px!important
                }

                .es-header-body h2 a, .es-content-body h2 a, .es-footer-body h2 a {
                    font-size: 32px!important
                }

                .es-header-body h3 a, .es-content-body h3 a, .es-footer-body h3 a {
                    font-size: 28px!important
                }

                .es-header-body h4 a, .es-content-body h4 a, .es-footer-body h4 a {
                    font-size: 24px!important
                }

                .es-header-body h5 a, .es-content-body h5 a, .es-footer-body h5 a {
                    font-size: 20px!important
                }

                .es-header-body h6 a, .es-content-body h6 a, .es-footer-body h6 a {
                    font-size: 16px!important
                }

                .es-menu td a {
                    font-size: 14px!important
                }

                .es-header-body p, .es-header-body a {
                    font-size: 14px!important
                }

                .es-content-body p, .es-content-body a {
                    font-size: 14px!important
                }

                .es-footer-body p, .es-footer-body a {
                    font-size: 14px!important
                }

                .es-infoblock p, .es-infoblock a {
                    font-size: 12px!important
                }

                .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3, .es-m-txt-c h4, .es-m-txt-c h5, .es-m-txt-c h6 {
                    text-align: center!important
                }

                .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3, .es-m-txt-r h4, .es-m-txt-r h5, .es-m-txt-r h6 {
                    text-align: right!important
                }

                .es-m-txt-j, .es-m-txt-j h1, .es-m-txt-j h2, .es-m-txt-j h3, .es-m-txt-j h4, .es-m-txt-j h5, .es-m-txt-j h6 {
                    text-align: justify!important
                }

                .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3, .es-m-txt-l h4, .es-m-txt-l h5, .es-m-txt-l h6 {
                    text-align: left!important
                }

                .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img {
                    display: inline!important
                }

                .es-m-txt-r .rollover:hover .rollover-second, .es-m-txt-c .rollover:hover .rollover-second, .es-m-txt-l .rollover:hover .rollover-second {
                    display: inline!important
                }

                .es-m-txt-r .rollover span, .es-m-txt-c .rollover span, .es-m-txt-l .rollover span {
                    line-height: 0!important;
                    font-size: 0!important;
                    display: block
                }

                .es-spacer {
                    display: inline-table
                }

                a.es-button, button.es-button {
                    font-size: 14px!important;
                    padding: 10px 20px 10px 20px!important;
                    line-height: 120%!important
                }

                a.es-button, button.es-button, .es-button-border {
                    display: inline-block!important
                }

                .es-m-fw, .es-m-fw.es-fw, .es-m-fw .es-button {
                    display: block!important
                }

                .es-m-il, .es-m-il .es-button, .es-social, .es-social td, .es-menu.es-table-not-adapt {
                    display: inline-block!important
                }

                .es-adaptive table, .es-left, .es-right {
                    width: 100%!important
                }

                .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header {
                    width: 100%!important;
                    max-width: 600px!important
                }

                .adapt-img {
                    width: 100%!important;
                    height: auto!important
                }

                .es-adapt-td {
                    display: block!important;
                    width: 100%!important
                }

                .es-mobile-hidden, .es-hidden {
                    display: none!important
                }

                .es-container-hidden {
                    display: none!important
                }

                .es-desk-hidden {
                    width: auto!important;
                    overflow: visible!important;
                    float: none!important;
                    max-height: inherit!important;
                    line-height: inherit!important
                }

                tr.es-desk-hidden {
                    display: table-row!important
                }

                table.es-desk-hidden {
                    display: table!important
                }

                td.es-desk-menu-hidden {
                    display: table-cell!important
                }

                .es-menu td {
                    width: 1%!important
                }

                table.es-table-not-adapt, .esd-block-html table {
                    width: auto!important
                }

                .h-auto {
                    height: auto!important
                }

                .es-text-8735 .es-text-mobile-size-16, .es-text-8735 .es-text-mobile-size-16 * {
                    font-size: 16px!important
                }

                .es-text-5018 .es-text-mobile-size-16, .es-text-5018 .es-text-mobile-size-16 * {
                    font-size: 16px!important
                }

                .es-text-2216 .es-text-mobile-size-16, .es-text-2216 .es-text-mobile-size-16 * {
                    font-size: 16px!important
                }

                .es-text-8735 .es-text-mobile-size-22, .es-text-8735 .es-text-mobile-size-22 * {
                    font-size: 22px!important
                }

                .es-text-5018 .es-text-mobile-size-22, .es-text-5018 .es-text-mobile-size-22 * {
                    font-size: 22px!important
                }

                .es-text-2216 .es-text-mobile-size-22, .es-text-2216 .es-text-mobile-size-22 * {
                    font-size: 22px!important
                }

                .es-text-5018 .es-text-mobile-size-18, .es-text-5018 .es-text-mobile-size-18 * {
                    font-size: 18px!important
                }

                .es-text-8735 .es-text-mobile-size-24, .es-text-8735 .es-text-mobile-size-24 * {
                    font-size: 24px!important
                }
            }

            @media screen and (max-width: 384px) {
                .mail-message-content {
                    width:414px!important
                }
            }
        </style>
    </head>
    <body class="body" style="width:100%;height:100%;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0">
        <div dir="ltr" class="es-wrapper-color" lang="und" style="background-color:#F6F6F6">
            <!--[if gte mso 9]><v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t"> <v:fill type="tile" color="#f6f6f6"></v:fill> </v:background><![endif]-->
            <table width="100%" cellspacing="0" cellpadding="0" class="es-wrapper" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-color:#F6F6F6">
                <tr>
                    <td valign="top" style="padding:0;Margin:0">
                        <table cellspacing="0" cellpadding="0" align="center" class="es-header" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-spacing:0px;width:100%;table-layout:fixed !important;background-color:transparent">
                            <tr>
                                <td align="center" style="padding:0;Margin:0">
                                    <table cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" class="es-header-body" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-spacing:0px;background-color:#FFFFFF;width:600px">
                                        <tr>
                                            <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-right:20px;padding-left:20px">
                                                <table cellspacing="0" cellpadding="0" align="right" class="es-right" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-spacing:0px;float:right">
                                                    <tr>
                                                        <td align="left" style="padding:0;Margin:0;width:560px">
                                                            <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-spacing:0px">
                                                                <tr>
                                                                    <td align="center" style="padding:0;Margin:0;font-size:0">
                                                                        <img width="560" src="https://mikasawor.com/sorteo-fkp-mail/images/hurdonankusuerte.jpg" alt="" class="adapt-img" style="display:block;font-size:14px;border:0;outline:none;text-decoration:none;margin:0;border-radius:20px" height="280">
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                        <table cellspacing="0" cellpadding="0" align="center" class="es-content" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-spacing:0px;width:100%;table-layout:fixed !important">
                            <tr>
                                <td align="center" style="padding:0;Margin:0">
                                    <table cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" class="es-content-body" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-spacing:0px;background-color:#FFFFFF;width:600px">
                                        <tr>
                                            <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-right:20px;padding-left:20px">
                                                <table width="100%" cellspacing="0" cellpadding="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-spacing:0px">
                                                    <tr>
                                                        <td valign="top" align="center" style="padding:0;Margin:0;width:560px">
                                                            <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-spacing:0px">
                                                                <tr>
                                                                    <td align="left" class="es-text-8735" style="padding:0;Margin:0;padding-top:10px;padding-bottom:15px">
                                                                        <p class="es-text-mobile-size-16" style="Margin:0;mso-line-height-rule:exactly;font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';line-height:24px;letter-spacing:0;color:#333333;font-size:16px">Konta [Nombre],</p>
                                                                        <p class="es-text-mobile-size-16" style="Margin:0;mso-line-height-rule:exactly;font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';line-height:24px;letter-spacing:0;color:#333333;font-size:16px">
                                                                            danki pa aktualisá bo informashon ku <strong>Fundashon Kas Popular (FKP)</strong>
                                                                            .
                                                                        </p>
                                                                        <p class="es-text-mobile-size-16" style="Margin:0;mso-line-height-rule:exactly;font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';line-height:24px;letter-spacing:0;color:#333333;font-size:16px">
                                                                            <br/>
                                                                        </p>
                                                                        <p class="es-text-mobile-size-16" style="Margin:0;mso-line-height-rule:exactly;font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';line-height:24px;letter-spacing:0;color:#002b7f;font-size:16px">
                                                                            <strong>Nos ta konfirmá ku bo informashon a keda verifiká ku éksito i ku awor bo ta partisipá na e sorteo eksklusivo pa hürdónan di FKP</strong>
                                                                            .
                                                                        </p>
                                                                        <p class="es-text-mobile-size-16" style="Margin:0;mso-line-height-rule:exactly;font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';line-height:24px;letter-spacing:0;color:#333333;font-size:16px">
                                                                            <br/>
                                                                        </p>
                                                                        <p class="es-text-mobile-size-16" style="Margin:0;mso-line-height-rule:exactly;font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';line-height:24px;letter-spacing:0;color:#333333;font-size:16px">Nos lo tene bo informá tokante e próksimo aktualisashonnan i e ganadónan.</p>
                                                                        <p class="es-text-mobile-size-16" style="Margin:0;mso-line-height-rule:exactly;font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';line-height:24px;letter-spacing:0;color:#333333;font-size:16px">
                                                                            <br/>
                                                                        </p>
                                                                        <p class="es-text-mobile-size-24" style="Margin:0;mso-line-height-rule:exactly;font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';line-height:36px;letter-spacing:0;color:#fdfdfe;font-size:24px;text-align:center">
                                                                            <strong>
                                                                                <span style="background:#002b7f">&nbsp;E sorteo lo ta dia 30 di desèmber pa 3:00 PM &nbsp;</span>
                                                                            </strong>
                                                                        </p>
                                                                        <p class="es-text-mobile-size-16" style="Margin:0;mso-line-height-rule:exactly;font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';line-height:24px;letter-spacing:0;color:#333333;font-size:16px">
                                                                            <br/>
                                                                        </p>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td align="left" bgcolor="#002b7f" class="es-text-5018" style="padding:0;Margin:0;padding-top:30px;padding-bottom:30px">
                                                                        <p class="es-text-mobile-size-16" style="Margin:0;mso-line-height-rule:exactly;font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';line-height:25.6px;letter-spacing:0;color:#ffffff;font-size:16px;text-align:center">
                                                                            <em>Premionan di e sorteo:</em>
                                                                        </p>
                                                                        <p class="es-text-mobile-size-16" style="Margin:0;mso-line-height-rule:exactly;font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';line-height:25.6px;letter-spacing:0;color:#ffffff;font-size:16px;text-align:center">
                                                                            <em>
                                                                                <br/>
                                                                            </em>
                                                                        </p>
                                                                        <p class="es-text-mobile-size-16" style="Margin:0;mso-line-height-rule:exactly;font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';line-height:28.8px;letter-spacing:0;color:#ffffff;font-size:16px;text-align:center">
                                                                            <strong>Promé premio</strong>
                                                                            <br>
                                                                            <span class="es-text-mobile-size-18" style="font-size:18px;line-height:28.8px">
                                                                                Gift Card di 
                                                                                <strong>
                                                                                    Mangusa Supermarket<br>
                                                                                </strong>
                                                                            </span>
                                                                            <span class="es-text-mobile-size-18" style="line-height:28.8px;color:#EFC100;font-size:18px">
                                                                                <strong>XCG 2,500</strong>
                                                                            </span>
                                                                        </p>
                                                                        <p class="es-text-mobile-size-16" style="Margin:0;mso-line-height-rule:exactly;font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';line-height:25.6px;letter-spacing:0;color:#ffffff;font-size:16px;text-align:center">
                                                                            <strong>
                                                                                <br/>
                                                                            </strong>
                                                                        </p>
                                                                        <p class="es-text-mobile-size-16" style="Margin:0;mso-line-height-rule:exactly;font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';line-height:28.8px;letter-spacing:0;color:#ffffff;font-size:16px;text-align:center">
                                                                            <strong>
                                                                                Di dos premio<br>
                                                                            </strong>
                                                                            <span class="es-text-mobile-size-18" style="font-size:18px">
                                                                                <strong></strong>
                                                                                Gift Card di 
                                                                                <strong>
                                                                                    Building Depot<br>
                                                                                </strong>
                                                                            </span>
                                                                            <span class="es-text-mobile-size-18" style="font-size:18px;color:#EFC100">
                                                                                <strong>XCG 1,500</strong>
                                                                            </span>
                                                                        </p>
                                                                        <p class="es-text-mobile-size-16" style="Margin:0;mso-line-height-rule:exactly;font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';line-height:25.6px;letter-spacing:0;color:#ffffff;font-size:16px;text-align:center">
                                                                            <strong>
                                                                                <br/>
                                                                            </strong>
                                                                        </p>
                                                                        <p class="es-text-mobile-size-16" style="Margin:0;mso-line-height-rule:exactly;font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';line-height:28.8px;letter-spacing:0;color:#ffffff;font-size:16px;text-align:center">
                                                                            <strong>Di tres premio</strong>
                                                                            <br>
                                                                            <span class="es-text-mobile-size-18" style="font-size:18px;line-height:28.8px">
                                                                                Gift Card di 
                                                                                <strong>
                                                                                    Boolchand's<br>
                                                                                    <span style="color:#efc100">XCG 1,000</span>
                                                                                </strong>
                                                                            </span>
                                                                        </p>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td align="left" class="es-text-2216" style="padding:0;Margin:0">
                                                                        <p class="es-text-mobile-size-16" style="Margin:0;mso-line-height-rule:exactly;font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';line-height:24px;letter-spacing:0;color:#333333;font-size:16px">
                                                                            <br/>
                                                                        </p>
                                                                        <p class="es-text-mobile-size-16" style="Margin:0;mso-line-height-rule:exactly;font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';line-height:24px;letter-spacing:0;color:#333333;font-size:16px">Un kordial saludo,</p>
                                                                        <p class="es-text-mobile-size-16" style="Margin:0;mso-line-height-rule:exactly;font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';line-height:24px;letter-spacing:0;color:#333333;font-size:16px">
                                                                            <strong>Tim di FKP</strong>
                                                                        </p>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                        <table cellspacing="0" cellpadding="0" align="center" class="es-footer" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-spacing:0px;width:100%;table-layout:fixed !important;background-color:transparent">
                            <tr>
                                <td align="center" style="padding:0;Margin:0">
                                    <table cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" class="es-footer-body" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-spacing:0px;background-color:#FFFFFF;width:600px">
                                        <tr>
                                            <td align="left" style="Margin:0;padding-top:20px;padding-right:20px;padding-left:20px;padding-bottom:20px">
                                                <table cellspacing="0" cellpadding="0" align="left" class="es-left" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-spacing:0px;float:left">
                                                    <tr>
                                                        <td align="left" class="es-m-p20b" style="padding:0;Margin:0;width:560px">
                                                            <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-spacing:0px">
                                                                <tr>
                                                                    <td align="center" style="padding:0;Margin:0;font-size:0">
                                                                        <a target="_blank" href="https://www.fkp.cw/" style="mso-line-height-rule:exactly;text-decoration:underline;color:#1376C8;font-size:14px">
                                                                            <img src="https://mikasawor.com/sorteo-fkp-mail/images/fkplogo.jpg" alt="Fundashon Kas Popular (FKP)" width="105" title="Fundashon Kas Popular (FKP)" height="82" style="display:block;font-size:14px;border:0;outline:none;text-decoration:none;margin:0">
                                                                        </a>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </div>
        <script defer src="https://static.cloudflareinsights.com/beacon.min.js/vcd15cbe7772f49c399c6a5babf22c1241717689176015" integrity="sha512-ZpsOmlRQV6y907TI0dKBHq9Md29nnaEIPlkf84rnaERnq6zvWvPUqr2ft8M1aS28oN72PdrCzSjY4U6VaAw1EQ==" data-cf-beacon='{"version":"2024.11.0","token":"4468348f3801412abcc48204546d4e21","r":1,"server_timing":{"name":{"cfCacheStatus":true,"cfEdge":true,"cfExtPri":true,"cfL4":true,"cfOrigin":true,"cfSpeedBrain":true},"location_startswith":null}}' crossorigin="anonymous"></script>
    </body>
</html>
    `
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
        const html = params?.Message?.Body?.Html?.Data || null;

        const emailParams = new EmailParams()
            .setFrom(sentFrom)
            .setTo(recipients)
            .setSubject(subject)
            .setReplyTo(sentFrom);

        if (html) {
            emailParams.setHtml(html);
        } else {
            emailParams.setText(text);
        }

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
    // const html = approved_email_template.html.replace('[Nombre]', nombre);

    const mailOptions = {
        Source: DEFAULT_FROM_EMAIL,
        Destination: { ToAddresses: [email] },
        Message: {
            Subject: { Data: approved_email_template.subject },
            Body: {
                Text: { Data: texto },
                // Html: { Data: html },   // 👈 AGREGADO
            },
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
