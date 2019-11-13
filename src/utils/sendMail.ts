import * as sgMail from "@sendgrid/mail";
import * as Mailgen from "mailgen";
import { Mailer } from "../types/graphql-utils";

const baseUrl = process.env.BASE_URL || "localhost:4000";
const projectName = process.env.PROJECT_NAME || "Typescript GraphQL";
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

export const sendForgotPasswordMail = (email: string, url: string) => {
    const link = `${url}`;
    const emailBody = {
        body: {
            name,
            title: `<h1 style="text-align: center; color: #000000"> ${projectName} </h1>`,
            intro:
                "You are receiving this email because a password reset request for your account was received.",
            action: {
                instructions:
                    "Tap the button below to reset your customer account password. If you didn't request a new password, you can safely delete this email.",
                button: {
                    color: "#335BCF",
                    text: "Reset Your Password",
                    link
                }
            },
            outro: `If that doesn't work, copy and paste the following link in your browser:\n\n${link}`
        }
    };
    // Generate an HTML email with the provided contents
    const message = mailGenerator.generate(emailBody);

    return sendMail({
        to: email,
        subject: `${projectName}: Forgot Password`,
        message
    });
};

export const sendResetSuccessMail = (email: string, url: string) => {
    const emailBody = {
      body: {
        name,
        title: `<h1 style="text-align: center; color: #000000"> ${projectName} </h1>`,
        intro: 'You are receiving this email because a password reset request for your account was received.',
        action: {
          instructions: `Your password has been successfully reset. Please login to ${projectName} by clicking the button below`,
          button: {
            color: 'green',
            text: 'Login',
            link: `${url}`
          }
        }
      }
    };
    // Generate an HTML email with the provided contents
    const message = mailGenerator.generate(emailBody);
  
    return sendMail({
      to: email,
      subject: `${projectName}: Reset Success`,
      message
    });
  };
