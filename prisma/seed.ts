import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear old
  await prisma.transaction.deleteMany();
  await prisma.budget.deleteMany();
  await prisma.category.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.listSettings.deleteMany();
  await prisma.list.deleteMany();

  // Create list
  const list = await prisma.list.create({
    data: {
      name: 'Personal',
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
  const catGym = await prisma.category.create({
    data: { listId: list.id, name: 'Gym', emoji: '🏋️', tint: '#7A5C43', type: 'expense' },
  });
  const catMama = await prisma.category.create({
    data: { listId: list.id, name: 'Mamá', emoji: '👩‍🍼', tint: '#8A7A55', type: 'expense' },
  });
  const catUber = await prisma.category.create({
    data: { listId: list.id, name: 'Uber', emoji: '🚘', tint: '#A05252', type: 'expense' },
  });
  const catComida = await prisma.category.create({
    data: { listId: list.id, name: 'Comida', emoji: '🍲', tint: '#8A6E4B', type: 'expense' },
  });
  const catPapa = await prisma.category.create({
    data: { listId: list.id, name: 'Papá', emoji: '👴', tint: '#A8862B', type: 'expense' },
  });
  const catSuscripcion = await prisma.category.create({
    data: { listId: list.id, name: 'Suscripción', emoji: '📺', tint: '#5B6A8A', type: 'expense' },
  });

  const now = new Date();
  const todayIso = now.toISOString().split('T')[0];

  // Seed transactions
  await prisma.transaction.createMany({
    data: [
      {
        listId: list.id,
        description: 'Bodyfit Fitness Center',
        amount: 105000,
        type: 'expense',
        categoryId: catGym.id,
        tags: JSON.stringify(['#gym', '#debito']),
        date: new Date(todayIso),
        recurrence: 'monthly',
      },
      {
        listId: list.id,
        description: 'Mamá fallabella',
        amount: 182400,
        type: 'expense',
        categoryId: catMama.id,
        tags: JSON.stringify(['#credito', '#mama']),
        date: new Date(todayIso),
        recurrence: 'once',
      },
      {
        listId: list.id,
        description: 'Uber',
        amount: 6226,
        type: 'expense',
        categoryId: catUber.id,
        tags: JSON.stringify(['#debito', '#mama']),
        date: new Date(todayIso),
        recurrence: 'once',
      },
      {
        listId: list.id,
        description: 'Qbano',
        amount: 48150,
        type: 'expense',
        categoryId: catComida.id,
        tags: JSON.stringify(['#credito', '#almuerzo']),
        date: new Date(todayIso),
        recurrence: 'once',
      },
      {
        listId: list.id,
        description: 'Dinero recibido de papá',
        amount: 200000,
        type: 'income',
        categoryId: catPapa.id,
        tags: JSON.stringify(['#papa']),
        date: new Date(todayIso),
        recurrence: 'once',
      },
      {
        listId: list.id,
        description: 'WhatsApp plus',
        amount: 2999,
        type: 'expense',
        categoryId: catSuscripcion.id,
        tags: JSON.stringify(['#suscripción']),
        date: new Date(todayIso),
        recurrence: 'monthly',
      },
    ],
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
