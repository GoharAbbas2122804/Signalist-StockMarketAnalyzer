import { email } from "better-auth";
import nodemailer from "nodemailer";
import { WELCOME_EMAIL_TEMPLATE } from "./templates";
import { text } from "stream/consumers";


export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.NODEMAILER_EMAIL!,
        pass: process.env.NODEMAILER_PASSWORD!,
    }
})



export const sendWelcomeEmail =  async ({email, name , intro}: WelcomeEmailData) => {
    const htmlTemplate = WELCOME_EMAIL_TEMPLATE.replace('{{name}}', name).replace('{{intro}}', intro);


    const mailOptions = {
        from: `"Signalist <${process.env.NODEMAILER_EMAIL}>`,
        to: email,
        subject: 'Welcome to Signalist, your stock market dashboard in ready',
        text: `Welcome to Signalist, your stock market dashboard in ready. You can now start tracking your favorite stocks and make smarter moves.`,
        html: htmlTemplate,
    }


    //now its time to send the email
    await transporter.sendMail(mailOptions);
}