import { ServiceRepository } from "../../repositories/service/service.repository.js";

export class ServiceDataService {
  private serviceRepository: ServiceRepository;

  constructor() {
    this.serviceRepository = new ServiceRepository();
  }

  async get() {
    return await this.serviceRepository.find();
  }
}
