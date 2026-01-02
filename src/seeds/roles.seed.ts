import { AppDataSource } from '../data-source';
import { Role } from '../modules/roles/roles.entity';

export async function seedRoles() {
  const repo = AppDataSource.getRepository(Role);

  const roles = ['ADMIN', 'EDITOR'];

  for (const name of roles) {
    const exists = await repo.findOne({ where: { name } });
    if (!exists) {
      await repo.save({ name });
    }
  }
}
