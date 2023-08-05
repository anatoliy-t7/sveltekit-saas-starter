import { render } from 'svelte-email';
import VerifyEmail from '$lib/components/emails/VerifyEmail.svelte';
import ResetPassword from '$lib/components/emails/ResetPassword.svelte';
import nodemailer from 'nodemailer';
import { PUBLIC_APP_NAME, PUBLIC_EMAIL } from '$env/static/public';
import { IncomingWebhook } from '@slack/webhook';
import { env } from '$env/dynamic/private';
const url = env.PRIVATE_SLACK_WEBHOOK_URL_STORE;

export async function sendEmail(email: string, subject: string, template: string, prop: any) {
	const transporter = nodemailer.createTransport({
		host: '127.0.0.1',
		port: 1025,
		secure: false
	});

	let emailHtml;
	if (template == 'verify-email') {
		emailHtml = render({
			template: VerifyEmail,
			props: {
				link: prop
			}
		});
	}

	if (template == 'reset-password') {
		emailHtml = render({
			template: ResetPassword,
			props: {
				link: prop
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
