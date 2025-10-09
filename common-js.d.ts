declare module '@barchart/common-js/lang/Day' {
    import DayFormatType from "@barchart/common-js/lang/DayFormatType";

    export default class Day {
        format(): string;

        get year(): number;
        get month(): number;
        get day(): number;

        addDays(days: number, inverse?: boolean): Day;

        static parse(value: string, type?: DayFormatType): Day;
        static fromDate(date: Date): Day;
    }
}

declare module '@barchart/common-js/lang/DayFormatType' {
    export default class DayFormatType {
        static get YYYY_MM_DD(): DayFormatType;
        static get MM_DD_YYYY(): DayFormatType;
        static get MM_DD_YY(): DayFormatType;
    }
}

declare module '@barchart/common-js/lang/Disposable' {
    export default class Disposable {
        get disposed(): boolean;

        dispose(): void;
    }
}

declare module '@barchart/common-js/lang/Timespan' {
    export default class Timespan {
        get days(): number;
        get hours(): number;
        get minutes(): number;
        get seconds(): number;
        get milliseconds(): number;
    }
}