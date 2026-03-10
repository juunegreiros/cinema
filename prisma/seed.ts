import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { faker } from '@faker-js/faker';

// Configuração da conexão para o Prisma 7
const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Iniciando o seed...');

  // 1. Criar Permissões
  const permissions = [];
  const permissionKeys = ['MOVIE_CREATE', 'MOVIE_DELETE', 'BOOKING_CREATE', 'ROOM_MANAGE'];
  for (const key of permissionKeys) {
    const permission = await prisma.permission.create({
      data: {
        key,
        description: `Permissão para ${key.toLowerCase().replace('_', ' ')}`,
      },
    });
    permissions.push(permission);
  }
  console.log(`Criadas ${permissions.length} permissões.`);

  // 2. Criar Roles
  const adminRole = await prisma.role.create({
    data: {
      name: 'Admin',
      description: 'Administrador do sistema com todas as permissões',
    },
  });

  const userRole = await prisma.role.create({
    data: {
      name: 'User',
      description: 'Usuário comum do cinema',
    },
  });

  // Associar permissões às roles
  for (const perm of permissions) {
    await prisma.rolePermission.create({
      data: { roleId: adminRole.id, permissionId: perm.id },
    });
  }
  
  const bookingPerm = permissions.find(p => p.key === 'BOOKING_CREATE');
  if (bookingPerm) {
    await prisma.rolePermission.create({
      data: { roleId: userRole.id, permissionId: bookingPerm.id },
    });
  }
  console.log('Roles e permissões vinculadas.');

  // 3. Criar Usuários
  const users = [];
  for (let i = 0; i < 5; i++) {
    const user = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        name: faker.person.fullName(),
        password: 'hashed_password_123',
      },
    });
    users.push(user);
    
    await prisma.userRole.create({
      data: {
        userId: user.id,
        roleId: i === 0 ? adminRole.id : userRole.id,
      },
    });
  }
  console.log(`Criados ${users.length} usuários com cargos.`);

  // 4. Criar Filmes
  const movies = [];
  const ageRatings = ['L', 'AGE_10', 'AGE_12', 'AGE_14', 'AGE_16', 'AGE_18'];
  for (let i = 0; i < 5; i++) {
    const movie = await prisma.movie.create({
      data: {
        title: faker.lorem.words(3),
        durationMinutes: faker.number.int({ min: 90, max: 180 }),
        ageRating: ageRatings[faker.number.int({ min: 0, max: ageRatings.length - 1 })] as any,
        active: true,
      },
    });
    movies.push(movie);
  }
  console.log(`Criados ${movies.length} filmes.`);

  // 5. Criar Salas e Assentos
  const rooms = [];
  const roomTypes = ['normal', 'pro_max', 'vip'];
  for (let i = 0; i < 3; i++) {
    const type = roomTypes[i] as any;
    const room = await prisma.room.create({
      data: {
        name: `Sala ${i + 1} (${type})`,
        type: type,
        active: true,
      },
    });
    rooms.push(room);

    const numSeats = type === 'vip' ? 10 : 20;
    for (let j = 0; j < numSeats; j++) {
      await prisma.seat.create({
        data: {
          identifier: `${String.fromCharCode(65 + Math.floor(j / 5))}${(j % 5) + 1}`,
          roomId: room.id,
          active: true,
        },
      });
    }
  }
  console.log(`Criadas ${rooms.length} salas com assentos.`);

  // 6. Criar Sessões
  for (const movie of movies) {
    const room = faker.helpers.arrayElement(rooms);
    const start = faker.date.soon({ days: 1 });
    const end = new Date(start.getTime() + (movie.durationMinutes + 10) * 60000);

    await prisma.session.create({
      data: {
        movieId: movie.id,
        roomId: room.id,
        start,
        end,
      },
    });
  }
  console.log('Sessões criadas.');

  console.log('Seed finalizado com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
