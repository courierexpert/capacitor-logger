import { registerPlugin } from '@capacitor/core';
import { setLoggerBridge } from './global';
import info from './info.json';
import Logger from './logger';
console.log(`loaded ${info.name} v${info.version}`);
async function loader() {
    return import('./bridge').then((module) => new module.LoggerBridge());
}
const bridge = registerPlugin('LoggerBridge', {
    web: loader,
    ios: loader,
    android: loader
});
setLoggerBridge(bridge);
export { LogLevel } from './definitions';
export { Logger };
