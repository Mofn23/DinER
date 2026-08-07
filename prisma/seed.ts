import { PrismaClient } from '@prisma/client';
import { INITIAL_CATEGORIES, INITIAL_TRANSACTIONS, INITIAL_LISTS } from '../src/lib/initialData';

const prisma = new PrismaClient();

async function main() {
  // Clear old data
  await prisma.transaction.deleteMany();
  await prisma.budget.deleteMany();
  await prisma.category.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.listSettings.deleteMany();
  await prisma.list.deleteMany();

  // Create list
  const list = await prisma.list.create({
    data: {
      id: 'list-1',
      name: 'RappiPay',
      currency: 'COP',
      defaultPeriod: 'Month',
      settings: {
        create: {
          showIncome: true,
          rollover: false,
          currency: 'COP',
          voiceLanguage: 'ES',
        },
      },
    },
  });

  // Seed categories
  for (const cat of INITIAL_CATEGORIES) {
    await prisma.category.create({
      data: {
        id: cat.id,
        listId: list.id,
        name: cat.name,
        emoji: cat.emoji,
        tint: cat.tint,
        type: cat.type,
      },
    });
  }

  // Seed transactions
  for (const tx of INITIAL_TRANSACTIONS) {
    await prisma.transaction.create({
      data: {
        id: tx.id,
        listId: list.id,
        description: tx.description,
        amount: tx.amount,
        type: tx.type,
        categoryId: tx.categoryId,
        tags: JSON.stringify(tx.tags),
        date: new Date(tx.date + 'T00:00:00'),
        recurrence: tx.recurrence,
      },
    });
  }

  console.log('Database seeded with 35 real transactions successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
