import 'dotenv/config';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

const isProd = process.env.NODE_ENV === 'production';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,

  synchronize: false,

  entities: isProd
    ? ['dist/**/*.entity.js']
    : ['src/**/*.entity.ts'],

  migrations: isProd
    ? ['dist/migrations/*.js']
    : ['src/migrations/*.ts'],
});
