"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldModule = void 0;
const common_1 = require("@nestjs/common");
const field_service_1 = require("./field.service");
const field_controller_1 = require("./field.controller");
const typeorm_1 = require("@nestjs/typeorm");
const field_entity_1 = require("./field.entity");
const field_group_module_1 = require("../field-groups/field-group.module");
let FieldModule = class FieldModule {
};
exports.FieldModule = FieldModule;
exports.FieldModule = FieldModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([field_entity_1.Field]),
            (0, common_1.forwardRef)(() => field_group_module_1.FieldGroupModule),
        ],
        providers: [field_service_1.FieldService],
        controllers: [field_controller_1.FieldController],
        exports: [field_service_1.FieldService],
    })
], FieldModule);
//# sourceMappingURL=field.module.js.map