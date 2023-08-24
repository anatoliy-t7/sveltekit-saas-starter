import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
	await prisma.user.upsert({
		where: { email: 'anatoliy.darma@gmail.com' },
		update: {},
		create: {
			id: '1ql9agf5g7f1ury',
			email: 'anatoliy.darma@gmail.com',
			name: 'Anatoliy',
			role: 'admin',
			active: true,
			email_verified: true
		}
	});

	await prisma.plan.create({
		data: {
			name: 'Basic',
			handle: 'basic',
			price: 1200,
			price_id: 'price_1NeJKKFpaScIaMO054tmpVpJ'
		}
	});

	await prisma.plan.create({
		data: {
			name: 'Pro',
			handle: 'pro',
			price: 3200,
			price_id: 'price_1NeJTxFpaScIaMO0lGBmbSkf'
		}
	});

	await prisma.plan.create({
		data: {
			name: 'Enterprise',
			handle: 'enterprise',
			price: 5600,
			price_id: 'price_1NeJUHFpaScIaMO0NePFGOnG'
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
