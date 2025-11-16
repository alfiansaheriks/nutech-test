import { BannerRepository } from "../../repositories/index.js";

export class BannerService {
  private bannerRepository: BannerRepository;

  constructor() {
    this.bannerRepository = new BannerRepository();
  }

  async get() {
    return await this.bannerRepository.find();
  }
}
