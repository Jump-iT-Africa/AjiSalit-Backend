import * as admin from 'firebase-admin';
export declare class FcmService {
    private firebaseApp;
    constructor(firebaseApp: admin.app.App);
    sendNotificationToDevice(deviceToken: string): Promise<{
        success: boolean;
        messageId: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        messageId?: undefined;
    }>;
}
