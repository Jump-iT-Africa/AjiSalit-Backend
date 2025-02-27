"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateJwt = validateJwt;
const jwt = require("jsonwebtoken");
function validateJwt(token) {
    let secretKey = process.env.JWT_SECRET;
    let results = jwt.verify(token, secretKey);
    return results;
}
//# sourceMappingURL=verifyJwt.js.map