import { prisma } from '../repositories/prisma';
import { comparePassword } from '../auth/password';
import { generateToken } from '../auth/jwt';

export const authService = {
  async login(email: string, password: string) {
    const user = await prisma.staffUser.findUnique({ where: { email } });
    if (!user || !user.isActive) return null;

    const isValid = await comparePassword(password, user.passwordHash);
    if (!isValid) return null;

    const token = generateToken({ userId: user.id, email: user.email });
    return {
      token,
      user: { id: user.id, email: user.email, name: user.name },
    };
  },

  async getUser(userId: string) {
    const user = await prisma.staffUser.findUnique({ where: { id: userId } });
    if (!user) return null;
    return { id: user.id, email: user.email, name: user.name };
  },
};
