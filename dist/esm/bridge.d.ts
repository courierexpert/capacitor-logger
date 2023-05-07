import { WebPlugin } from '@capacitor/core';
import type { LoggerBridgePlugin, NativeLogData } from './definitions';
/**
 * This class is the actual native plugin that acts as a bridge
 * between the native and web implementations.
 */
export declare class LoggerBridge extends WebPlugin implements LoggerBridgePlugin {
    log(_data: NativeLogData): Promise<void>;
    setUseSyslog(_useSyslog: {
        use: boolean;
    }): Promise<void>;
}
