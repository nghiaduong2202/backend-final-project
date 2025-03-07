import { Injectable } from '@nestjs/common';
import { CreateDraftProvider } from './create-draft.provider';
import { CreateDraftDto } from '../dtos/create-draft.dto';
import { GetFacilityByIdProvider } from './get-facility-by-id.provider';
import { UUID } from 'crypto';
import { GetMyFacilityProvider } from './get-my-facility.provider';
import { ApproveFacilityProvider } from './approve-facility.provider';
import { RejectFacilityProvider } from './reject-facility.provider';
import { UpdateFacilityProvider } from './update-facility.provider';
import { UpdateFacilityDto } from '../dtos/update-facility.dto';
import { DeleteFacilityProvider } from './delete-facility.provider';

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
    /**
     * inject accept facility provider
     */
    private readonly approveFacilityProvider: ApproveFacilityProvider,
    /**
     * inject reject facility provider
     */
    private readonly rejectFacilityProvider: RejectFacilityProvider,
    /**
     * inject update facility provider
     */
    private readonly updateFacilityProvider: UpdateFacilityProvider,
    /**
     * inject delte facility provider
     */
    private readonly deleteFacilityProvider: DeleteFacilityProvider,
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

  public async approveFacility(facilityId: number) {
    return await this.approveFacilityProvider.acceptFacility(facilityId);
  }

  public async rejectFacility(facilityId: number) {
    return await this.rejectFacilityProvider.rejectFacility(facilityId);
  }

  public async updateFacility(
    updateFacilityDto: UpdateFacilityDto,
    ownerId: UUID,
  ) {
    return await this.updateFacilityProvider.updateFacility(
      updateFacilityDto,
      ownerId,
    );
  }

  public async deleteFacility(facilityId: number, ownerId: UUID) {
    return await this.deleteFacilityProvider.deleteFacility(
      facilityId,
      ownerId,
    );
  }
}
