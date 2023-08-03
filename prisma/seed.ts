import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
	await prisma.authUser.upsert({
		where: { email: 'anatoliy.darma@gmail.com' },
		update: {},
		create: {
			id: '9c9e3469-7c91-482a-b120-83dacbd9bf60',
			email: 'anatoliy.darma@gmail.com',
			name: 'Anatoliy',
			role: 'admin',
			email_verified: true
		}
	});
	await prisma.authKey.upsert({
		where: { id: 'email:anatoliy.darma@gmail.com' },
		update: {},
		create: {
			id: 'email:anatoliy.darma@gmail.com',
			hashed_password:
				's2:sYr6BczvxLwe6XH1:6d43a192d1554dda764442f07307e6ff2e4ce6a010833903834ed8d950ee34d635ce5bf3a970a4cb26d15d441f81dd0f168fb669340de604f16ae8961863f9ca',
			user_id: '9c9e3469-7c91-482a-b120-83dacbd9bf60',
			primary_key: true,
			expires: null
		}
	});
}
main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
