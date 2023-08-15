import { z } from 'zod';
// See https://zod.dev/?id=primitives for schema syntax
export const userSchema = z.object({
	id: z.string().optional(),
	name: z.string().nullable(),
	email: z.string().email(),
	role: z.string().default('client'),
	active: z.boolean(),
	password: z.string(),
	email_verified: z.boolean()
});

export const otpSchema = z.object({
	otp: z.string().max(6),
	email: z.string()
});
