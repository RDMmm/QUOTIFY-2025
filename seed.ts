import bcrypt from 'bcrypt';
import { prisma } from './prisma';

async function seedAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (existing) {
    console.log('Admin already exists:', adminEmail);
    return;
  }
  const passwordHash = await bcrypt.hash(adminPassword, 10);
  await prisma.user.create({
    data: {
      email: adminEmail,
      passwordHash,
      role: 'admin',
    },
  });
  console.log('Seeded admin:', adminEmail);
}

if (require.main === module) {
  seedAdmin()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());
}

export default seedAdmin;
