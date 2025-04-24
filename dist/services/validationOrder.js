"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationOrder = ValidationOrder;
function ValidationOrder(newOrder) {
    if (newOrder.situation == "خالص" || newOrder.situation == "غير خالص") {
        if (newOrder.advancedAmount !== null)
            return "Ops you have to choose the situation of partially paid to be able to add advanced amount";
    }
    if (newOrder.situation == "تسبيق") {
        if (newOrder.price <= newOrder.advancedAmount)
            return "The advanced amount of The order suppose to be less than the total price";
    }
    let todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    if (newOrder.deliveryDate < todayDate) {
        return "The delivery Date is not valid, you can't deliver in the past";
    }
    return "valide";
}
//# sourceMappingURL=validationOrder.js.map