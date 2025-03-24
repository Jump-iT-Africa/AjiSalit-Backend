"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FcmModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const admin = require("firebase-admin");
const fcm_service_1 = require("./fcm.service");
const firebaseProvider = {
    provide: 'FIREBASE_APP',
    inject: [config_1.ConfigService],
    useFactory: () => {
        const firebaseConfig = {
            type: process.env.TYPE,
            project_id: process.env.PROJECT_ID,
            private_key_id: process.env.PRIVATE_KEY_ID,
            private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
            client_email: process.env.CLIENT_EMAIL,
            client_id: process.env.CLIENT_ID,
            auth_uri: process.env.AUTH_URI,
            token_uri: process.env.TOKEN_URI,
            auth_provider_x509_cert_url: process.env.AUTH_CERT_URL,
            client_x509_cert_url: process.env.CLIENT_CERT_URL,
            universe_domain: process.env.UNIVERSAL_DOMAIN,
        };
        return admin.initializeApp({
            credential: admin.credential.cert(firebaseConfig),
        });
    },
};
let FcmModule = class FcmModule {
};
exports.FcmModule = FcmModule;
exports.FcmModule = FcmModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule],
        providers: [fcm_service_1.FcmService, firebaseProvider],
        exports: [fcm_service_1.FcmService],
    })
], FcmModule);
//# sourceMappingURL=fcm.module.js.map