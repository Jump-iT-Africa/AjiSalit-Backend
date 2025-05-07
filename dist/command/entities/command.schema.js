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
exports.CommandSchema = exports.Command = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose = require("mongoose");
let Command = class Command {
};
exports.Command = Command;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose.Schema.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", String)
], Command.prototype, "companyId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false, default: null }),
    __metadata("design:type", String)
], Command.prototype, "clientId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: "غير خالص", enum: ["خالص", "غير خالص", "تسبيق"] }),
    __metadata("design:type", String)
], Command.prototype, "situation", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: "في طور الانجاز", enum: ["في طور الانجاز", "جاهزة للتسليم", "تم تسليم"] }),
    __metadata("design:type", String)
], Command.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: false }),
    __metadata("design:type", Boolean)
], Command.prototype, "isExpired", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false, default: null }),
    __metadata("design:type", Number)
], Command.prototype, "advancedAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Command.prototype, "price", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", Array)
], Command.prototype, "images", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", Date)
], Command.prototype, "deliveryDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false, default: null }),
    __metadata("design:type", Date)
], Command.prototype, "pickupDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Command.prototype, "qrCode", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: false }),
    __metadata("design:type", Boolean)
], Command.prototype, "isFinished", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: false }),
    __metadata("design:type", Boolean)
], Command.prototype, "isPickUp", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false, default: false }),
    __metadata("design:type", Boolean)
], Command.prototype, "isDateChanged", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], Command.prototype, "ChangeDateReason", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false, default: null }),
    __metadata("design:type", Date)
], Command.prototype, "newDate", void 0);
exports.Command = Command = __decorate([
    (0, mongoose_1.Schema)()
], Command);
exports.CommandSchema = mongoose_1.SchemaFactory.createForClass(Command);
//# sourceMappingURL=command.schema.js.map