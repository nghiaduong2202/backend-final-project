import { Injectable } from '@nestjs/common';
import { CreateDraftProvider } from './create-draft.provider';
import { CreateDraftDto } from '../dtos/create-draft.dto';
import { GetFacilityByIdProvider } from './get-facility-by-id.provider';
import { UUID } from 'crypto';
import { GetMyFacilityProvider } from './get-my-facility.provider';

@Injectable()
export class FacilityService {
  constructor(
    /**
     * inject create draft provider
     */
    private readonly createDraftProvider: CreateDraftProvider,
    /**
     * inject get facility by id provider
     */
    private readonly getFacilityByIdProvider: GetFacilityByIdProvider,
    /**
     * inject get my facility provider
     */
    private readonly getMyFacilityProvider: GetMyFacilityProvider,
  ) {}

  public async createDraft(createDraftDto: CreateDraftDto, ownerId: UUID) {
    return await this.createDraftProvider.createDraft(createDraftDto, ownerId);
  }

  public async getFacilityById(id: number) {
    return await this.getFacilityByIdProvider.getFacilityById(id);
  }

  public async getMyFacility(ownerId: UUID) {
    return await this.getMyFacilityProvider.getMyFacility(ownerId);
  }
}
