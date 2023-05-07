export var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["silent"] = 0] = "silent";
    LogLevel[LogLevel["error"] = 1] = "error";
    LogLevel[LogLevel["warn"] = 2] = "warn";
    LogLevel[LogLevel["info"] = 3] = "info";
    LogLevel[LogLevel["debug"] = 4] = "debug";
})(LogLevel || (LogLevel = {}));
