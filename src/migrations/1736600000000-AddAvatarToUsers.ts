// migrations/1736600000000-AddAvatarToUsers.ts
import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddAvatarToUsers1736600000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'avatarUrl',
        type: 'varchar',
        length: '255',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'avatarUrl');
  }
}
