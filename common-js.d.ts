declare module '@barchart/common-js/lang/Day' {
    export default class Day {
        format(): string;

        get year(): number;
        get month(): number;
        get day(): number;

        addDays(days: number, inverse?: boolean): Day;

        static parse(value: string): Day;
        static fromDate(date: Date): Day;
    }
}