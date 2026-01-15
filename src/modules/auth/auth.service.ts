import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /* ======================
     LOGIN
  ====================== */
  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user || !user.active) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      roleId: user.role.id,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      expiresIn: 1800,
      mustChangePassword: user.passwordChanged === 0,
    };
  }

  /* ======================
     CHANGE PASSWORD
  ====================== */
  async changePassword(
    userId: number,
    dto: { currentPassword: string; newPassword: string },
  ) {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    const match = await bcrypt.compare(dto.currentPassword, user.password);

    if (!match) {
      throw new UnauthorizedException('Senha atual incorreta');
    }

    await this.usersService.update(user.id, {
      password: dto.newPassword,
      passwordChanged: 1,
    });

    return { success: true };
  }

  /* ======================
     AUTH ME
  ====================== */
  async me(userId: number) {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new UnauthorizedException();
    }

    delete (user as any).password;
    return user;
  }
}
