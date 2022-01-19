import isObjectLike from "lodash/isObjectLike";
import isString from "lodash/isString";
import { isNull, isDigit, isDate, parserStringNumber } from "./utils";
import { FieldInfo, MergeTypes } from "./interface";
import { intDatePartners } from "./is-date";
import { autoToFixed } from "../util";

export function getValueType(value: any) {
    if (isNull(value)) return "null";

    const paserInfo = parserStringNumber(value);

    if (paserInfo.isNumber) {
        if (Number.isInteger(paserInfo.number)) {
            if (isDate(value)) {
                return "date";
            }
            return "integer";
        }
        return "float";
    } else return "string";
}
/**
 * 获取值
 * @param value 普通值或者object
 * @param key key值
 */
function getValue(value: any, key?: string) {
    if (isObjectLike(value) && isString(key)) {
        return value[key];
    }
    return value;
}
export function analyzeNumber(
    array: (number | Record<string, number>)[],
    key?: string
) {
    let min = 0;
    let max = 0;
    let sum = 0;
    let unit = "";
    for (let i = 0; i < array.length; i++) {
        const valueInfo = parserStringNumber(getValue(array[i], key));
        if (!valueInfo.isNumber) {
            continue;
        }
        if (i === 0) {
            min = valueInfo.number;
        }
        if (unit === "") {
            unit = valueInfo.unit;
        }
        if (valueInfo.number > max) {
            max = valueInfo.number;
        }
        if (valueInfo.number < min) {
            min = valueInfo.number;
        }

        sum += valueInfo.number;
    }

    return {
        min: min,
        max: max,
        avg: autoToFixed(sum / array.length),
        median: autoToFixed((min + max) / 2),
        sum: sum,
        unit,
    };
}
export function analyzeString(
    array: (number | Record<string, string>)[],
    key?: string
) {
    let maxStr = "";
    for (let i = 0; i < array.length; i++) {
        const value = getValue(array[i], key);
        if (value.length) {
            if (value.length > maxStr.length) {
                maxStr = value;
            }
        }
    }
    return {
        maxStr: maxStr,
    };
}
/**
 * 在object对象找出最大的value值
 * @param obj
 * @example
 * findMaxOfObject({string: 1, number: 3, null: 2}) // -->[number, 3]
 */
export function findMaxOfObject(obj: {
    [key: string]: number;
}): [string, number] {
    let max = 0;
    let maxKey = "";
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const value = obj[key];
            if (value > max) {
                max = value;
                maxKey = key;
            }
        }
    }
    return [maxKey, max];
}

/**
 * get a array type info
 * @param data
 * @param key 如果data是object[]，则key是object中的某个键值
 */
export default function type(data: any[], key?: string): MergeTypes {
    if (!Array.isArray(data)) {
        throw TypeError("Data muse be a array");
    }

    let missing = 0;
    let maxLength = 0;
    // 把类型缓存为map，因为有可能有垃圾数据，所以会出现多种类型。
    const typeMap: Record<FieldInfo["type"], number> = data.reduce<
        Record<FieldInfo["type"], number>
    >(function (pre, current) {
        const currentValue = getValue(current, key);
        const type = getValueType(currentValue);

        if (pre[type] === undefined) {
            pre[type] = 1;
        }
        pre[type]++;

        if (isNull(currentValue)) {
            missing++;
        } else {
            const toStr = String(currentValue);
            if (toStr.length > maxLength) {
                maxLength = currentValue.length;
            }
        }

        return pre;
    }, {} as Record<FieldInfo["type"], number>);
    let fieldType: FieldInfo["type"];

    if (Object.keys(typeMap).length > 3) {
        fieldType = "mixed";
    } else if (data.length > 6 && Object.keys(typeMap).length > 1) {
        fieldType = findMaxOfObject(typeMap)[0] as FieldInfo["type"];
    } else if (typeMap["integer"] > 0) {
        // ['-', '-', 1]
        fieldType = "integer";
    } else if (typeMap["float"] > 0) {
        // ['-', '-', 1]
        fieldType = "float";
    } else if (typeMap["date"] > 0) {
        fieldType = "date";
    } else if (typeMap["string"] > 0) {
        fieldType = "string";
    } else {
        fieldType = "null";
    }
    // second verification: like 1993 2000
    if (fieldType === "integer") {
        const numerList = data.filter((item) => getValue(item, key) !== null);
        let dataCount = 0;
        const matchPartnerMap = {};

        for (let i = 0; i < numerList.length; i++) {
            const value = getValue(numerList[i], key);
            const isDate = intDatePartners.some((p) => {
                if (p.test(value)) {
                    matchPartnerMap[p.source] = 1;
                    return true;
                }
            });
            // 判定是否命中多个正则
            if (Object.keys(matchPartnerMap).length > 1) {
                break;
            }
            if (isDate) {
                dataCount++;
            }
            if (dataCount > numerList.length * 0.9) {
                fieldType = "date";
                break;
            }
        }
    }
    const info: MergeTypes = {
        type: fieldType,
        missing: missing,
        len: data.length,
        maxLength,
    };
    if (fieldType === "integer" || fieldType === "float") {
        Object.assign(info, analyzeNumber(data, key));
    } else if (fieldType === "string" || fieldType === "date") {
        Object.assign(info, analyzeString(data, key));
    }
    return info;
}
