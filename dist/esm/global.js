// This is kept in a separate file to avoid circular dependencies
let bridge;
export function getLoggerBridge() {
    return bridge;
}
export function setLoggerBridge(plugin) {
    bridge = plugin;
}
