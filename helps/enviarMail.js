// 1. Librerías (Uso consistente de imports)
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// 2. Configuración de variables de entorno
dotenv.config();

// 3. Definir __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const enviarMail = async (nombre, email) => {
    console.log(`Iniciando proceso de envío para: ${nombre}`);

    try {
        const templatePath = path.join(__dirname, '..', 'templates', 'welcomeMail.html');
        const logoPath = path.join(__dirname, '..', 'assets', 'Logo-LetrasVerdes.png');
        const htmlTemplate = fs.readFileSync(templatePath, 'utf8');

        // 5. Configurar el transportador
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: false,
            tls: {
                rejectUnauthorized: false,
            },
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },

            connectionTimeout: 10000, 
            greetingTimeout: 10000,
            socketTimeout: 10000,
        });

        // 6. Configurar el email
        const mailOptions = {
            from: `"${process.env.SMTP_NAME}" <${process.env.SMTP_USER}>`, // Queda más profesional con un nombre
            to: email,
            subject: '¡Bienvenido! Tu cuenta ha sido creada 🚀',
            text: `Hola ${nombre}, tu cuenta ha sido registrada con éxito.`,
            html: htmlTemplate.replace('{{nombre}}', nombre).replace('{{logo}}', 'cid:logo'),
            attachments: [
                { filename: 'logo.png', path: logoPath, cid: 'logo' }
            ],
        };

        // 7. Enviar
        await transporter.sendMail(mailOptions);
        console.log('✅ Email enviado con éxito');

    } catch (err) {
        console.error('❌ Error en enviarMail:', err.message);
    }
};

export const enviarMailPedido = async ({ nombre, email, datosEnvio, items, total }) => {
    try {
        const templatePath = path.join(__dirname, '..', 'templates', 'pedidoMail.html');
        const logoPath = path.join(__dirname, '..', 'assets', 'Logo-LetrasVerdes.png');
        let html = fs.readFileSync(templatePath, 'utf8');

        const itemsHtml = items.map(item =>
            `<tr><td>${item.nombre} x${item.cantidad}</td><td>$${(item.precio * item.cantidad).toLocaleString('es-AR')}</td></tr>`
        ).join('')

        const modalidadTexto = datosEnvio.modalidad === 'retiro' ? 'Retiro en local' : 'Envio a domicilio'

        const itemsTexto = items.map(i => `  - ${i.nombre} x${i.cantidad} -> $${(i.precio * i.cantidad).toLocaleString('es-AR')}`).join('\n')
        const mensajeWp = `Hola Pipo & Co! Acabo de confirmar un pedido.\n\n*Nombre:* ${datosEnvio.nombre}\n*Email:* ${datosEnvio.email}\n*Direccion:* ${datosEnvio.direccion}, ${datosEnvio.ciudad}, ${datosEnvio.provincia} (${datosEnvio.cp})\n\n*Productos:*\n${itemsTexto}\n\n*Total:* $${total.toLocaleString('es-AR')}\n\n*Modalidad:* ${modalidadTexto}\n\nGracias! Quedo a disposicion para coordinar el pedido.`
        const whatsappUrl = `https://wa.me/5493517707999?text=${encodeURIComponent(mensajeWp)}`

        html = html
            .replace('{{logo}}', 'cid:logo')
            .replace(/{{nombre}}/g, datosEnvio.nombre)
            .replace('{{email}}', datosEnvio.email)
            .replace('{{direccion}}', datosEnvio.direccion)
            .replace('{{ciudad}}', datosEnvio.ciudad)
            .replace('{{provincia}}', datosEnvio.provincia)
            .replace('{{cp}}', datosEnvio.cp)
            .replace('{{modalidad}}', modalidadTexto)
            .replace('{{items}}', itemsHtml)
            .replace('{{total}}', `$${total.toLocaleString('es-AR')}`)
            .replace('{{whatsapp_url}}', whatsappUrl)

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: true,
            auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        });

        await transporter.sendMail({
            from: `"${process.env.SMTP_NAME}" <${process.env.SMTP_USER}>`,
            to: datosEnvio.email,
            subject: 'Confirmacion de pedido - Pipo & Co',
            html,
            attachments: [
                { filename: 'logo.png', path: logoPath, cid: 'logo' }
            ],
        });

        console.log('✅ Mail de pedido enviado');
    } catch (err) {
        console.error('❌ Error en enviarMailPedido:', err.message);
    }
};