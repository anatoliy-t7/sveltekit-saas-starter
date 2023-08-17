import { render } from 'svelte-email';
import SendOtp from '$lib/components/emails/SendOtp.svelte';
import nodemailer from 'nodemailer';
import { PUBLIC_APP_NAME, PUBLIC_EMAIL } from '$env/static/public';
import { IncomingWebhook } from '@slack/webhook';
import { env } from '$env/dynamic/private';
import { dev } from '$app/environment';
const url = env.PRIVATE_SLACK_WEBHOOK_URL_STORE;

export async function sendEmail(email: string, subject: string, template: string, prop: any) {
	const transporter = nodemailer.createTransport({
		host: env.PRIVATE_EMAIL_SERVER_HOST,
		port: env.PRIVATE_EMAIL_SERVER_PORT,
		secure: !dev,
		auth: {
			user: env.PRIVATE_EMAIL_SERVER_USER,
			pass: env.PRIVATE_EMAIL_SERVER_PASSWORD
		}
	});

	let emailHtml;

	if (template == 'send-otp') {
		emailHtml = render({
			template: SendOtp,
			props: {
				otp: prop
			}
		});
	}

	const options = {
		from: PUBLIC_EMAIL,
		to: email,
		subject: `${subject} - ${PUBLIC_APP_NAME}`,
		html: emailHtml
	};

	await transporter.sendMail(options);
}

export function sendDataToSlack(data: any): void {
	const webhook = new IncomingWebhook(url, {
		icon_emoji: '💚'
	});

	(async () => {
		await webhook.send({
			text: data.title,
			blocks: [
				{
					type: 'section',
					text: {
						type: 'mrkdwn',
						text: data.text
					}
				}
			]
		});
	})();
}

export const serializeNonPOJOs = (obj: object) => {
	return JSON.parse(JSON.stringify(obj));
};
