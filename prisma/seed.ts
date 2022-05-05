import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const email = "rachel@remix.run";
  const hashedPassword = await bcrypt.hash("racheliscool", 10);

  const found = await prisma.client.findFirst({
    where: { email }
  })

  if (found) {
    return
  }

  const client = await prisma.client.create({
    data: {
      email,
      name: 'Remix',
      nif: 'nif',
      stat: 'stat',
      telephones: '032 63 498 64'
    }
  })

  const user = await prisma.user.create({
    data: {
      name: 'Rachel',
      firstName: 'Green',
      active: true,
      email,
      clientId: client.id,
      role: 0,
    }
  })

  const password = await prisma.password.create({
    data: {
      hash: hashedPassword,
      userId: user.id
    }
  })

  const address = await prisma.address.create({
    data: {
      region: 'Analamanga',
      commune: 'Sabotsy Namehana'
    }
  })

  const site = await prisma.site.create({
    data: {
      name: 'SAEP Sabotsy Namehana',
      clientId: client.id,
      addressId: address.id
    }
  })

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
