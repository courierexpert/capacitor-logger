import type { ILogger, LogLevelMap, Options } from './definitions';
import { LogLevel } from './definitions';
/**
 * This is the class that users will instantiate to log messages.
 */
export default class Logger implements ILogger {
    static kDefaultLevelLabels: Record<string, string>;
    private _level;
    private readonly _labels;
    private _tag;
    private _useSyslog;
    private readonly timers;
    constructor(tag: string, options?: Options);
    get level(): LogLevel;
    set level(level: LogLevel | string);
    get levelName(): string;
    set levelName(level: string);
    getLevelWithName(name: string): LogLevel | undefined;
    get labels(): LogLevelMap;
    set labels(labels: LogLevelMap);
    get tag(): string;
    set tag(tag: string);
    silent(_message: string): void;
    error(message: string): void;
    warn(message: string): void;
    info(message: string): void;
    log(message: string): void;
    debug(message: string): void;
    logAtLevel(level: LogLevel | string, message: string): void;
    logWithTagAtLevel(level: LogLevel | string, tag: string, message: string): void;
    dir(value: unknown): void;
    private logMessage;
    clear(): void;
    count(label?: string | undefined): void;
    countReset(label?: string | undefined): void;
    group(...label: any[]): void;
    groupCollapsed(...label: any[]): void;
    groupEnd(): void;
    table(tabularData: any, properties?: readonly string[] | undefined): void;
    time(label?: string | undefined): void;
    timeLog(label?: string): void;
    timeEnd(label?: string): void;
    private static formatMilliseconds;
    private static resolveTimerLabel;
    private static timeLabelToString;
    trace(): void;
    get useSyslog(): boolean;
    set useSyslog(use: boolean);
}
