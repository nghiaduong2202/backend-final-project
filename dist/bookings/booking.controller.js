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
exports.BookingController = void 0;
const common_1 = require("@nestjs/common");
const booking_service_1 = require("./booking.service");
const create_draft_booking_dto_1 = require("./dtos/requests/create-draft-booking.dto");
const active_person_decorator_1 = require("../auths/decorators/active-person.decorator");
let BookingController = class BookingController {
    bookingService;
    constructor(bookingService) {
        this.bookingService = bookingService;
    }
    createDraft(createDraftBookingDto, playerId) {
        return this.bookingService.createDraft(createDraftBookingDto, playerId);
    }
};
exports.BookingController = BookingController;
__decorate([
    __param(0, (0, common_1.Body)()),
    __param(1, (0, active_person_decorator_1.ActivePerson)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_draft_booking_dto_1.CreateDraftBookingDto, String]),
    __metadata("design:returntype", void 0)
], BookingController.prototype, "createDraft", null);
exports.BookingController = BookingController = __decorate([
    (0, common_1.Controller)('booking'),
    __metadata("design:paramtypes", [booking_service_1.BookingService])
], BookingController);
//# sourceMappingURL=booking.controller.js.map