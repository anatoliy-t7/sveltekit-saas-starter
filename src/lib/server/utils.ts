import { render } from 'svelte-email';
import SendOtp from '$lib/components/emails/SendOtp.svelte';
import nodemailer from 'nodemailer';
import { IncomingWebhook } from '@slack/webhook';
import { dev } from '$app/environment';
import { PUBLIC_APP_NAME, PUBLIC_EMAIL } from '$env/static/public';
import {
	PRIVATE_EMAIL_SERVER_HOST,
	PRIVATE_EMAIL_SERVER_PORT,
	PRIVATE_EMAIL_SERVER_USER,
	PRIVATE_EMAIL_SERVER_PASSWORD,
	PRIVATE_SLACK_WEBHOOK_URL_STORE
} from '$env/static/private';

export async function sendEmail(email: string, subject: string, template: string, prop: any) {
	const transporter = nodemailer.createTransport({
		host: PRIVATE_EMAIL_SERVER_HOST,
		port: PRIVATE_EMAIL_SERVER_PORT,
		secure: !dev,
		auth: {
			user: PRIVATE_EMAIL_SERVER_USER,
			pass: PRIVATE_EMAIL_SERVER_PASSWORD
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
	const webhook = new IncomingWebhook(PRIVATE_SLACK_WEBHOOK_URL_STORE, {
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

export const serializeNonPOJOs = (obj: any) => {
	return JSON.parse(JSON.stringify(obj));
};
