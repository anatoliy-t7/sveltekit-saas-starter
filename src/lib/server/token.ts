import { generateRandomString, isWithinExpiration } from 'lucia/utils';
import { db } from '$lib/server/prisma';
import { error } from '@sveltejs/kit';

const EXPIRES_IN = 1000 * 60 * 60 * 60;

export const generateEmailVerificationToken = async (userId: string) => {
	const storedUserTokens = await db.emailVerificationToken.findMany({
		where: {
			user_id: userId
		}
	});
	if (storedUserTokens.length > 0) {
		const reusableStoredToken = storedUserTokens.find((token) => {
			return isWithinExpiration(Number(token.expires) - EXPIRES_IN / 2);
		});
		if (reusableStoredToken) return reusableStoredToken.id;
	}
	const token = generateRandomString(63);
	await db.emailVerificationToken.create({
		data: {
			id: token,
			expires: new Date().getTime() + EXPIRES_IN,
			user_id: userId
		}
	});

	return token;
};

export const validateEmailVerificationToken = async (token: string) => {
	const storedToken = await db.$transaction(async (trx) => {
		const storedToken: any = await trx.emailVerificationToken.findUnique({
			where: {
				id: token
			}
		});

		if (!storedToken)
			return error(400, {
				message: 'Invalid token'
			});

		await trx.emailVerificationToken.deleteMany({
			where: {
				user_id: storedToken.user_id
			}
		});
		return storedToken;
	});

	const tokenExpires = Number(storedToken.expires); // bigint => number conversion
	if (!isWithinExpiration(tokenExpires)) {
		return error(400, {
			message: 'Invalid token'
		});
	}
	return storedToken.user_id;
};

export const generatePasswordResetToken = async (userId: string) => {
	const storedUserTokens = await db.passwordResetToken.findMany({
		where: {
			user_id: userId
		}
	});

	if (storedUserTokens.length > 0) {
		const reusableStoredToken = storedUserTokens.find((token) => {
			return isWithinExpiration(Number(token.expires) - EXPIRES_IN / 2);
		});
		if (reusableStoredToken) return reusableStoredToken.id;
	}
	const token = generateRandomString(63);
	await db.passwordResetToken.create({
		data: {
			id: token,
			expires: new Date().getTime() + EXPIRES_IN,
			user_id: userId
		}
	});

	return token;
};

export const validatePasswordResetToken = async (token: string) => {
	const storedToken = await db.$transaction(async (trx) => {
		const storedToken: any = await trx.passwordResetToken.findUnique({
			where: {
				id: token
			}
		});

		if (!storedToken)
			return error(400, {
				message: 'Invalid token'
			});

		await trx.passwordResetToken.deleteMany({
			where: {
				user_id: storedToken.user_id
			}
		});
		return storedToken;
	});

	const tokenExpires = Number(storedToken.expires); // bigint => number conversion
	if (!isWithinExpiration(tokenExpires)) {
		return error(400, {
			message: 'Invalid token'
		});
	}
	return storedToken.user_id;
};
