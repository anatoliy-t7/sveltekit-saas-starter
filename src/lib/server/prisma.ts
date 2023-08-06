import { PrismaClient } from '@prisma/client';
import pagination from 'prisma-extension-pagination';
import slugify from 'slugify';

const db = new PrismaClient({
	errorFormat: 'pretty'
}).$extends(pagination);

const getSlug = async (name: any, collectionName: string) => {
	const collection = db[collectionName];
	let slug = slugify(name, {
		lower: true,
		strict: true,
		remove: /[*+~.()'"!:@]/g
	});

	let attempt = 0;

	while ((await collection.count({ where: { slug } })) > 0) {
		attempt += 1;
		slug = `${slug}-${attempt}`;
	}

	return slug;
};

export { db, getSlug };
