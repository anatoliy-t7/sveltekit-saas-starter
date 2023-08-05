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

// export const generatePasswordResetToken = async (userId: string) => {
// 	const storedUserTokens = await db
// 		.selectFrom('password_reset_token')
// 		.selectAll()
// 		.where('user_id', '=', userId)
// 		.execute();
// 	if (storedUserTokens.length > 0) {
// 		const reusableStoredToken = storedUserTokens.find((token) => {
// 			// check if expiration is within 1 hour
// 			// and reuse the token if true
// 			return isWithinExpiration(Number(token.expires) - EXPIRES_IN / 2);
// 		});
// 		if (reusableStoredToken) return reusableStoredToken.id;
// 	}
// 	const token = generateRandomString(63);
// 	await db
// 		.insertInto('password_reset_token')
// 		.values({
// 			id: token,
// 			expires: new Date().getTime() + EXPIRES_IN,
// 			user_id: userId
// 		})
// 		.executeTakeFirst();
// 	return token;
// };

// export const validatePasswordResetToken = async (token: string) => {
// 	const storedToken = await db.transaction().execute(async (trx) => {
// 		const storedToken = await trx
// 			.selectFrom('password_reset_token')
// 			.selectAll()
// 			.where('id', '=', token)
// 			.executeTakeFirst();
// 		if (!storedToken) throw new Error('Invalid token');
// 		await trx.deleteFrom('password_reset_token').where('id', '=', token).executeTakeFirst();
// 		return storedToken;
// 	});
// 	const tokenExpires = Number(storedToken.expires); // bigint => number conversion
// 	if (!isWithinExpiration(tokenExpires)) {
// 		throw new Error('Expired token');
// 	}
// 	return storedToken.user_id;
// };

// export const isValidPasswordResetToken = async (token: string) => {
// 	const storedToken = await db
// 		.selectFrom('password_reset_token')
// 		.selectAll()
// 		.where('id', '=', token)
// 		.executeTakeFirst();
// 	if (!storedToken) return false;
// 	const tokenExpires = Number(storedToken.expires); // bigint => number conversion
// 	if (!isWithinExpiration(tokenExpires)) {
// 		return false;
// 	}
// 	return true;
// };
