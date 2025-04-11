"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacilityService = void 0;
const common_1 = require("@nestjs/common");
const facility_entity_1 = require("./facility.entity");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const person_service_1 = require("../people/person.service");
const field_group_service_1 = require("../field-groups/field-group.service");
const certificate_service_1 = require("../certificates/certificate.service");
const license_service_1 = require("../licenses/license.service");
const cloud_uploader_service_1 = require("../cloud-uploader/cloud-uploader.service");
const facility_status_enum_1 = require("./enums/facility-status.enum");
const approve_service_1 = require("../approves/approve.service");
const approve_type_enum_1 = require("../approves/enums/approve-type.enum");
let FacilityService = class FacilityService {
    facilityRepository;
    dataSource;
    personService;
    fieldGroupService;
    certificateService;
    licenseService;
    cloudUploaderService;
    approveService;
    constructor(facilityRepository, dataSource, personService, fieldGroupService, certificateService, licenseService, cloudUploaderService, approveService) {
        this.facilityRepository = facilityRepository;
        this.dataSource = dataSource;
        this.personService = personService;
        this.fieldGroupService = fieldGroupService;
        this.certificateService = certificateService;
        this.licenseService = licenseService;
        this.cloudUploaderService = cloudUploaderService;
        this.approveService = approveService;
    }
    async findOneByIdAndOwnerId(facilityId, ownerId) {
        return await this.facilityRepository
            .findOneOrFail({
            where: {
                id: facilityId,
                owner: {
                    id: ownerId,
                },
            },
        })
            .catch(() => {
            throw new common_1.NotFoundException(`Not found facility by id: ${facilityId} of owner: ${ownerId}`);
        });
    }
    async create(createFacilityDto, images, ownerId, certificate, licenses, sportIds) {
        let facilityId;
        await this.dataSource.transaction(async (manager) => {
            const owner = await this.personService.findOneByIdWithTransaction(ownerId, manager);
            const facility = manager.create(facility_entity_1.Facility, {
                ...createFacilityDto,
                owner,
            });
            try {
                await manager.save(facility);
            }
            catch {
                throw new common_1.BadRequestException('An error occurred when create facility');
            }
            for (const fieldGroup of createFacilityDto.fieldGroups) {
                await this.fieldGroupService.createWithTransaction(fieldGroup, facility, manager);
            }
            await this.certificateService.createWithTransaction(certificate, facility, manager);
            if (sportIds && licenses) {
                if (sportIds.length !== licenses.length) {
                    throw new common_1.BadRequestException('sportIds and licenses must be the same length');
                }
                const uniqueSportIds = new Set(sportIds);
                if (uniqueSportIds.size !== sportIds.length) {
                    throw new common_1.BadRequestException('sportIds must be unique set');
                }
                for (let i = 0; i < licenses.length; i++) {
                    await this.licenseService.createWithTransaction(licenses[i], facility, sportIds[i], manager);
                }
            }
            const iamgesUrl = [];
            for (const image of images) {
                const { secure_url } = await this.cloudUploaderService.upload(image);
                iamgesUrl.push(String(secure_url));
            }
            const newFacility = await manager
                .findOneOrFail(facility_entity_1.Facility, {
                where: {
                    id: facility.id,
                },
            })
                .catch(() => {
                throw new common_1.BadRequestException();
            });
            newFacility.imagesUrl = iamgesUrl;
            await manager.save(newFacility);
            facilityId = newFacility.id;
        });
        await this.approveService.create(facilityId, {
            type: approve_type_enum_1.ApproveTypeEnum.FACILITY,
        });
        return {
            message: 'Create facility successful',
        };
    }
    async getAll() {
        const facilities = await this.facilityRepository.find({
            relations: {
                owner: true,
                fieldGroups: {
                    sports: true,
                },
            },
        });
        return facilities.map(({ fieldGroups, ...facility }) => ({
            ...facility,
            sports: fieldGroups
                .map((fieldGroup) => fieldGroup.sports)
                .flat()
                .filter((item, index, self) => index === self.findIndex((t) => t.id === item.id)),
        }));
    }
    async getDropDownInfo(ownerId) {
        const facilities = await this.facilityRepository.find({
            relations: {
                fieldGroups: {
                    sports: true,
                },
            },
            select: {
                id: true,
                name: true,
                fieldGroups: true,
            },
            where: {
                owner: {
                    id: ownerId,
                },
                status: (0, typeorm_1.In)([facility_status_enum_1.FacilityStatusEnum.ACTIVE, facility_status_enum_1.FacilityStatusEnum.CLOSED]),
            },
            order: {
                name: 'ASC',
            },
        });
        return facilities.map(({ fieldGroups, ...facility }) => ({
            ...facility,
            sports: fieldGroups
                .map((fieldGroup) => fieldGroup.sports)
                .flat()
                .filter((item, index, self) => index === self.findIndex((t) => t.id === item.id)),
        }));
    }
    async getByOwner(ownerId) {
        const facilities = await this.facilityRepository.find({
            where: {
                owner: {
                    id: ownerId,
                },
            },
            relations: {
                fieldGroups: {
                    sports: true,
                },
            },
        });
        return facilities.map(({ fieldGroups, ...facility }) => ({
            ...facility,
            sports: fieldGroups
                .map((fieldGroup) => fieldGroup.sports)
                .flat()
                .filter((item, index, self) => index === self.findIndex((t) => t.id === item.id)),
            minPrice: Math.min(...fieldGroups.map((fieldGroup) => fieldGroup.basePrice)),
            maxPrice: Math.max(...fieldGroups.map((fieldGroup) => fieldGroup.basePrice)),
        }));
    }
    async getByFacility(facilityId) {
        return this.facilityRepository
            .findOneOrFail({
            relations: {
                fieldGroups: {
                    fields: true,
                    sports: true,
                },
                owner: true,
                licenses: true,
                certificate: true,
            },
            where: {
                id: facilityId,
            },
        })
            .catch(() => {
            throw new common_1.NotFoundException(`Not found facility with id: ${facilityId}`);
        });
    }
    async findOneById(facilityId) {
        return this.facilityRepository
            .findOneOrFail({
            where: {
                id: facilityId,
            },
        })
            .catch(() => {
            throw new common_1.NotFoundException('Not found the facility');
        });
    }
    async approve(facility) {
        if (facility.status !== facility_status_enum_1.FacilityStatusEnum.PENDING) {
            throw new common_1.BadRequestException('The facility is not pending');
        }
        facility.status = facility_status_enum_1.FacilityStatusEnum.ACTIVE;
        return await this.facilityRepository.save(facility);
    }
    async reject(facility) {
        if (facility.status !== facility_status_enum_1.FacilityStatusEnum.PENDING) {
            throw new common_1.BadRequestException('The facility is not pending');
        }
        facility.status = facility_status_enum_1.FacilityStatusEnum.UNACTIVE;
        return await this.facilityRepository.save(facility);
    }
};
exports.FacilityService = FacilityService;
exports.FacilityService = FacilityService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(facility_entity_1.Facility)),
    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => field_group_service_1.FieldGroupService))),
    __param(4, (0, common_1.Inject)((0, common_1.forwardRef)(() => certificate_service_1.CertificateService))),
    __param(5, (0, common_1.Inject)((0, common_1.forwardRef)(() => license_service_1.LicenseService))),
    __param(7, (0, common_1.Inject)((0, common_1.forwardRef)(() => approve_service_1.ApproveService))),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.DataSource,
        person_service_1.PersonService,
        field_group_service_1.FieldGroupService,
        certificate_service_1.CertificateService,
        license_service_1.LicenseService,
        cloud_uploader_service_1.CloudUploaderService,
        approve_service_1.ApproveService])
], FacilityService);
//# sourceMappingURL=facility.service.js.map