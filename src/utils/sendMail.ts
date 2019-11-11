import * as sgMail from "@sendgrid/mail";
import * as Mailgen from "mailgen";
import { Mailer } from "../types/graphql-utils";

const baseUrl = process.env.BASE_URL || "localhost:4000";
const projectName = process.env.PROJECT_NAME || "Typescipt GraphQL";
const projectEmail = process.env.PROJECT_EMAIL || "noreply@typescript.com";

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

// Configure the mail gen
const mailGenerator = new Mailgen({
    theme: "default",
    product: {
        name: projectName,
        link: baseUrl
    }
});

const sendMail = ({ to, subject, message }: Mailer) => {
    const mailOptions = {
        from: `${projectName} <${projectEmail}>`,
        to,
        subject,
        html: message
    };

    sgMail.send(mailOptions);
};

export const sendVerifyMailToken = async (email: string, url: string) => {
    const name = email.split("@")[0];
    const emailBody = {
        body: {
            name,
            title: `<h1 style="text-align: center; color: #000000"> ${projectName} </h1>`,
            intro: `Welcome <b>${name}</b>, glad to have you onboard. Please verify your mail to enjoy premium access.`,
            action: {
                instructions:
                    "Click on the button below to verify your mail and start enjoying full access.",
                button: {
                    color: "#335BCF",
                    text: "Verify Your Account",
                    link: `${url}`
                }
            },
            outro: `If that doesn't work, copy and paste the following link in your browser:
            \n\n<a href=${url}>${url}</a>`
        }
    };
    // Generate an HTML email with the provided contents
    const message = mailGenerator.generate(emailBody);

    await sendMail({
        to: email,
        subject: `${projectName}: Verify Account`,
        message
    });
};
