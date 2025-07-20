declare module '@barchart/common-js/lang/DayFormatType' {
    export default class DayFormatType {
        static get YEAR_MONTH_DAY(): DayFormatType;
        static get MONTH_DAY_YEAR(): DayFormatType;
    }
}

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