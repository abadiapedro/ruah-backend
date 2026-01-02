import { AppDataSource } from '../data-source';
import { seedRoles } from './roles.seed';
import { seedAdmin } from './admin.seed';
import { seedHome } from './home.seed';

async function run() {
  await AppDataSource.initialize();

  await seedRoles();
  await seedAdmin();
  await seedHome();

  await AppDataSource.destroy();
}

run();
