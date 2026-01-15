import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPasswordChangedToUsers1768341730941 implements MigrationInterface {
    name = 'AddPasswordChangedToUsers1768341730941'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`password_changed\` tinyint(1) NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`password_changed\``);
    }

}
