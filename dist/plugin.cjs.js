'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var core = require('@capacitor/core');

// This is kept in a separate file to avoid circular dependencies
let bridge$2;
function getLoggerBridge() {
    return bridge$2;
}
function setLoggerBridge(plugin) {
    bridge$2 = plugin;
}

var info = {
  name: "@aparajita/capacitor-logger",
  version: "3.1.1"
};

exports.LogLevel = void 0;
(function (LogLevel) {
    LogLevel[LogLevel["silent"] = 0] = "silent";
    LogLevel[LogLevel["error"] = 1] = "error";
    LogLevel[LogLevel["warn"] = 2] = "warn";
    LogLevel[LogLevel["info"] = 3] = "info";
    LogLevel[LogLevel["debug"] = 4] = "debug";
})(exports.LogLevel || (exports.LogLevel = {}));

const isNative = core.Capacitor.isNativePlatform();
// Make a reverse map of LogLevel to string
const kLevelsByName = {};
const keys = Object.keys(exports.LogLevel).filter((key) => /\D+/u.test(key));
keys.forEach((key, index) => {
    kLevelsByName[key] = index;
});
const kDefaultTimerLabel = Symbol('default');
function logError(error) {
    console.error(`[Logger] ${error.message}`);
}
/**
 * This is the class that users will instantiate to log messages.
 */
class Logger {
    constructor(tag, options) {
        this._level = exports.LogLevel.info;
        this._labels = new Map(Object.entries(Logger.kDefaultLevelLabels).map(([key, value]) => [
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this.getLevelWithName(key),
            value
        ]));
        this._useSyslog = false;
        this.timers = new Map();
        this._tag = tag;
        if (options) {
            if (typeof options.level === 'number') {
                this._level = options.level;
            }
            if (typeof options.labels === 'object') {
                this.labels = options.labels;
            }
            if (typeof options.useSyslog === 'boolean') {
                this._useSyslog = options.useSyslog;
            }
        }
    }
    get level() {
        return this._level;
    }
    set level(level) {
        if (typeof level === 'string') {
            const logLevel = this.getLevelWithName(level);
            if (logLevel) {
                this._level = logLevel;
            }
        }
        else {
            this._level = level;
        }
    }
    get levelName() {
        return exports.LogLevel[this._level];
    }
    set levelName(level) {
        const index = Object.values(exports.LogLevel).indexOf(level);
        if (index >= 0) {
            this._level = index;
        }
    }
    getLevelWithName(name) {
        return kLevelsByName[name];
    }
    get labels() {
        return Object.fromEntries(this._labels);
    }
    set labels(labels) {
        for (const [level, label] of Object.entries(labels)) {
            if (label) {
                const logLevel = this.getLevelWithName(level);
                if (logLevel) {
                    this._labels.set(logLevel, label);
                }
            }
        }
    }
    get tag() {
        return this._tag;
    }
    set tag(tag) {
        if (tag) {
            this._tag = tag;
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    silent(_message) {
        // This is here to facilitate dynamically calling
        // a logging method based on a level name without having
        // to special-case 'silent' in the code.
    }
    error(message) {
        this.logMessage(exports.LogLevel.error, this.tag, message);
    }
    warn(message) {
        this.logMessage(exports.LogLevel.warn, this.tag, message);
    }
    info(message) {
        this.logMessage(exports.LogLevel.info, this.tag, message);
    }
    log(message) {
        this.info(message);
    }
    debug(message) {
        this.logMessage(exports.LogLevel.debug, this.tag, message);
    }
    logAtLevel(level, message) {
        this.logWithTagAtLevel(level, this.tag, message);
    }
    logWithTagAtLevel(level, tag, message) {
        var _a;
        const logLevel = typeof level === 'string'
            ? (_a = this.getLevelWithName(level)) !== null && _a !== void 0 ? _a : exports.LogLevel.info
            : level;
        if (this._level >= logLevel) {
            this.logMessage(logLevel, tag, message);
        }
    }
    dir(value) {
        if (this._level < exports.LogLevel.info) {
            return;
        }
        if (isNative) {
            if (value && typeof value === 'object') {
                this.info(`${value.constructor.name}: ${JSON.stringify(value, null, 2)}`);
            }
            else {
                this.info(JSON.stringify(value));
            }
        }
        else {
            console.dir(value);
        }
    }
    logMessage(level, tag, message) {
        var _a;
        if (this._level < level) {
            return;
        }
        const label = (_a = this._labels.get(level)) !== null && _a !== void 0 ? _a : '';
        if (isNative) {
            getLoggerBridge()
                .log({
                level,
                tag,
                label,
                message
            })
                .catch(logError);
        }
        else {
            let msg;
            if (label) {
                // If the label is ASCII, put it after the tag, otherwise before.
                // eslint-disable-next-line @typescript-eslint/no-magic-numbers
                if (label.charCodeAt(0) < 128) {
                    msg = `[${tag}] ${label}: ${message}`;
                }
                else {
                    msg = `${label} [${tag}]: ${message}`;
                }
            }
            else {
                msg = `[${tag}]: ${message}`;
            }
            // @ts-expect-error - We are legitimately indexing the console object
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            console[exports.LogLevel[level]](msg);
        }
    }
    clear() {
        if (!isNative) {
            console.clear();
        }
    }
    count(label) {
        if (!isNative) {
            console.count(label);
        }
    }
    countReset(label) {
        if (!isNative) {
            console.countReset(label);
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    group(...label) {
        if (!isNative) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            console.group(...label);
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    groupCollapsed(...label) {
        if (!isNative) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            console.groupCollapsed(...label);
        }
    }
    groupEnd() {
        if (!isNative) {
            console.groupEnd();
        }
    }
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/no-explicit-any
    table(tabularData, properties) {
        if (!isNative) {
            console.table(tabularData, properties);
        }
    }
    time(label) {
        this.timers.set(Logger.resolveTimerLabel(label), Date.now());
    }
    timeLog(label) {
        const resolvedLabel = Logger.resolveTimerLabel(label);
        if (!this.timers.has(resolvedLabel)) {
            this.warn(`timer '${Logger.timeLabelToString(resolvedLabel)}' does not exist`);
            return;
        }
        const startTime = this.timers.get(resolvedLabel);
        if (startTime) {
            const endTime = Date.now();
            const duration = endTime - startTime;
            this.info(`${Logger.timeLabelToString(resolvedLabel)}: ${Logger.formatMilliseconds(duration)}`);
        }
    }
    timeEnd(label) {
        this.timeLog(label);
        this.timers.delete(Logger.resolveTimerLabel(label));
    }
    static formatMilliseconds(milliseconds) {
        /* eslint-disable @typescript-eslint/no-magic-numbers */
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const millisecondsRemainder = milliseconds % 1000;
        if (seconds < 1) {
            return `${milliseconds}ms`;
        }
        if (minutes < 1) {
            return `${seconds}.${millisecondsRemainder}s`;
        }
        const secs = (seconds % 60).toString().padStart(2, '0');
        if (hours < 1) {
            const millis = millisecondsRemainder.toString().padStart(3, '0');
            return `${minutes}:${secs}.${millis} (min:sec.ms)`;
        }
        const mins = (minutes % 60).toString().padStart(2, '0');
        return `${hours}:${mins}:${secs} (hr:min:sec)`;
        /* eslint-enable */
    }
    static resolveTimerLabel(label) {
        // eslint-disable-next-line no-unneeded-ternary
        return label ? label : kDefaultTimerLabel;
    }
    static timeLabelToString(label) {
        var _a;
        return typeof label === 'string'
            ? label
            : (_a = kDefaultTimerLabel.description) !== null && _a !== void 0 ? _a : 'default';
    }
    trace() {
        var _a;
        if (isNative) {
            let stack = (_a = new Error().stack) !== null && _a !== void 0 ? _a : '<no stack>';
            // Remove "Error" at the top of the stack
            stack = stack.replace(/^\s*Error.*\n/u, '');
            this.info(`trace\n${stack}`);
        }
        else {
            console.trace();
        }
    }
    get useSyslog() {
        return this._useSyslog;
    }
    set useSyslog(use) {
        this._useSyslog = use;
        if (core.Capacitor.getPlatform() === 'ios') {
            getLoggerBridge().setUseSyslog({ use }).catch(logError);
        }
    }
}
Logger.kDefaultLevelLabels = {
    [exports.LogLevel[exports.LogLevel.silent]]: '',
    [exports.LogLevel[exports.LogLevel.error]]: '🔴',
    [exports.LogLevel[exports.LogLevel.warn]]: '🟠',
    [exports.LogLevel[exports.LogLevel.info]]: '🟢',
    [exports.LogLevel[exports.LogLevel.debug]]: '🔎'
};

console.log(`loaded ${info.name} v${info.version}`);
async function loader() {
    return Promise.resolve().then(function () { return bridge; }).then((module) => new module.LoggerBridge());
}
const bridge$1 = core.registerPlugin('LoggerBridge', {
    web: loader,
    ios: loader,
    android: loader
});
setLoggerBridge(bridge$1);

/**
 * This class is the actual native plugin that acts as a bridge
 * between the native and web implementations.
 */
// eslint-disable-next-line import/prefer-default-export
class LoggerBridge extends core.WebPlugin {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async log(_data) {
        // This is a no-op on the web
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async setUseSyslog(_useSyslog) {
        // This is a no-op on the web
    }
}

var bridge = /*#__PURE__*/Object.freeze({
    __proto__: null,
    LoggerBridge: LoggerBridge
});

exports.Logger = Logger;
