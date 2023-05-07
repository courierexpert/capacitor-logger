import { WebPlugin } from '@capacitor/core';
/**
 * This class is the actual native plugin that acts as a bridge
 * between the native and web implementations.
 */
// eslint-disable-next-line import/prefer-default-export
export class LoggerBridge extends WebPlugin {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async log(_data) {
        // This is a no-op on the web
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async setUseSyslog(_useSyslog) {
        // This is a no-op on the web
    }
}
