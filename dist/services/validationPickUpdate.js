"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationPickUpdate = validationPickUpdate;
function validationPickUpdate(data) {
    try {
        let currentFullDate = new Date();
        currentFullDate.setHours(0, 0, 0, 0);
        data.pickupDate = new Date(data.pickupDate);
        if (data.pickupDate < currentFullDate) {
            return "The pickup Date is not valid, Please pick up another Date rather it's today or in the future";
        }
        return "valid";
    }
    catch (e) {
        console.log("Ops smth went wrong in validation", e);
        return "The pickup Date is not valid, Please pick up another Date rather it's today or in the future";
    }
}
//# sourceMappingURL=validationPickUpdate.js.map