import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { CategoriesModule } from './modules/categories/categories.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProductsModule } from './modules/products/products.module';
import { RolesModule } from './modules/roles/roles.module';
import { UsersModule } from './modules/users/users.module';
import { AboutModule } from './modules/about/about.module';
import { HomeModule } from './modules/home/home.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot(databaseConfig()),
    CategoriesModule,
    AuthModule,
    ProductsModule,
    RolesModule,
    UsersModule,
    AboutModule,
    HomeModule,
  ],
})
export class AppModule { }
