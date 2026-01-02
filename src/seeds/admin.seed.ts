import { AppDataSource } from '../data-source';
import { User } from '../modules/users/users.entity';
import { Role } from '../modules/roles/roles.entity';
import * as bcrypt from 'bcrypt';

export async function seedAdmin() {
  const userRepo = AppDataSource.getRepository(User);
  const roleRepo = AppDataSource.getRepository(Role);

  const adminRole = await roleRepo.findOne({ where: { name: 'ADMIN' } });
  if (!adminRole) return;

  const exists = await userRepo.findOne({
    where: { email: 'admin@sigmasoft.com' },
  });

  if (!exists) {
    await userRepo.save({
      name: 'Super Administrador',
      email: 'admin@sigmasoft.com',
      password: await bcrypt.hash('superadmin123', 10),
      role: adminRole,
      active: true,
    });
  }
}
