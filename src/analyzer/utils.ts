import { isDateString } from "./is-date";

export function assert(test: any, errorMessage: string): void {
    if (test) throw new Error(errorMessage);
}

export function isDigit(source: string): boolean {
    let hasDot = false;
    if (/^[+-]/.test(source)) {
        source = source.slice(1);
    }
    for (const char of source) {
        if (char === ".") {
            if (hasDot === false) {
                hasDot = true;
                continue;
            } else {
                return false;
            }
        }
        if (!/[0-9]/.test(char)) {
            return false;
        }
    }
    return source.trim() !== "";
}

export function isNull(source: any): boolean {
    return (
        source === null ||
        source === undefined ||
        source === "" ||
        Number.isNaN(source as number) ||
        "null" === source
    );
}

export function isInteger(source: any): boolean {
    if (typeof source === "number") return Number.isInteger(source);
    if (typeof source === "string" && isDigit(source))
        return !source.includes(".");
    return false;
}

export function isFloat(source: any): boolean {
    if (typeof source === "number")
        return !Number.isNaN(source) && !Number.isInteger(source);
    if (typeof source === "string" && isDigit(source))
        return source.includes(".");
    return false;
}

export function isDate(source: any): boolean {
    if (source && Object.getPrototypeOf(source) === Date.prototype) return true;
    if (typeof source === "string") return isDateString(source);
    return false;
}
/**
 * 解析字符数字,拆解数字正负、绝对值、单位。 0判定为正数
 * @param value
 * @example
 * parserStringNumber('-10.1%') => {isNumber: true, number: -10.1, abs: 10.1, unit: '%', digit: 1}
 */
export const parserStringNumber = function (value: number | string) {
    if (value === null || value === undefined) {
        return {
            isNumber: false,
        };
    }
    value = value.toString();
    // 匹配数字
    const matchNumber = value.match(/^-?\d+(\.\d+)?/);
    const isNumber = matchNumber !== null;

    if (!isNumber || matchNumber == null) {
        return {
            isNumber,
        };
    }
    // 数字
    const num = matchNumber ? Number(matchNumber[0]) : 0;
    // 去掉数字就是单位
    const unit = value.replace(matchNumber[0], "");
    const abs = Math.abs(num);
    const pointIndex = matchNumber[0].indexOf(".");

    return {
        isNumber,
        number: num,
        /**
         * 绝对值
         */
        abs,
        /**
         * 单位
         */
        unit,
        /**
         * 小数位数
         */
        digit: pointIndex > -1 ? matchNumber[0].length - 1 - pointIndex : 0,
    };
};
