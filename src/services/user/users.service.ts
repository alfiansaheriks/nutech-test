import { BalanceRepository, UserRepository } from "../../repositories/index.js";
import type { LoginPayload, RegisterPayload, UserUpdateImagePayload, UserUpdatePayload } from "../../types/user.js";
import { comparePassword, hashPassword } from "../../utils/bcrypt.js";
import { deleteFile } from "../../utils/file.js";
import { sign } from "../../utils/jwt.js";

export class UserService {
  private repository: UserRepository;
  private balanceRepository: BalanceRepository;

  constructor() {
    this.repository = new UserRepository();
    this.balanceRepository = new BalanceRepository();
  }

  async checkUser(email: string) {
    const check = await this.repository.findByEmail(email);
    if (check.rows.length === 0) {
      return null;
    }
    return check.rows[0];
  }

  async register(payload: RegisterPayload) {
    const checkEmail = await this.repository.findByEmail(payload.email);

    if (checkEmail.rows.length > 0) {
      throw new Error("Email sudah terdaftar");
    }

    const hashedPassword = await hashPassword(payload.password);
    const userPayload = {
      ...payload,
      password: hashedPassword,
    };

    const users = await this.repository.store(userPayload);
    await this.balanceRepository.insertBalance(users.id, 0);
    return users;
  }

  async login(payload: LoginPayload) {
    const user = await this.checkUser(payload.email);
    if (!user) {
      throw new Error("Email tidak ditemukan");
    }

    const isPasswordValid = await comparePassword(payload.password, user.password);
    if (!isPasswordValid) {
      throw new Error("Username atau salah");
    }

    const token = sign({ id: user.id, email: user.email });

    return token;
  }

  async profile(email: string) {
    const user = await this.repository.findProfile(email);
    return user.rows[0];
  }

  async updateProfile(email: string, payload: UserUpdatePayload) {
    const user = await this.repository.update(email, payload);
    return user.rows[0];
  }

  async updateImage(email: string, payload: UserUpdateImagePayload) {
    const profile = await this.profile(email);

    if (profile?.profile_image) {
      deleteFile(profile.profile_image);
    }

    const user = await this.repository.updateImage(email, payload);
    return user.rows[0];
  }
}
