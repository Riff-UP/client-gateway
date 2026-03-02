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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventAttendanceSchema = exports.EventAttendance = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let EventAttendance = class EventAttendance {
    event_id;
    sql_user_id;
    status;
};
exports.EventAttendance = EventAttendance;
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], EventAttendance.prototype, "event_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], EventAttendance.prototype, "sql_user_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], EventAttendance.prototype, "status", void 0);
exports.EventAttendance = EventAttendance = __decorate([
    (0, mongoose_1.Schema)({ timestamps: { createdAt: 'created_at', updatedAt: false } })
], EventAttendance);
exports.EventAttendanceSchema = mongoose_1.SchemaFactory.createForClass(EventAttendance);
exports.EventAttendanceSchema.index({ created_at: -1 });
//# sourceMappingURL=event-attendance.schema.js.map