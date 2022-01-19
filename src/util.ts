import { format } from "echarts/lib/export";
import { Dataset, SDTDataset, ColTypeInfo, DimensionObject } from "./interface";
import { type } from "./analyzer";

export function strEnum<T extends string>(o: Array<T>): { [K in T]: K } {
    return o.reduce((res, key) => {
        res[key] = key;
        return res;
    }, Object.create(null));
}

/**
 * 创建数组
 */
export const createArray = <T>(num: number, callback: (index: number) => T) => {
    const arr: T[] = [];
    for (let index = 0; index < num; index++) {
        arr.push(callback(index));
    }
    return arr;
};
export const getSourceItemType = function (source: any[]) {
    return source.length > 0 && Array.isArray(source[0])
        ? "array[]"
        : "object[]";
};
function findeDimensionIndex(dimensions: Dataset["dimensions"], name: string) {
    function getDimensionName(dimension: string | DimensionObject): string {
        return typeof dimension === "string"
            ? (dimension as string)
            : (dimension as DimensionObject).name;
    }
    return dimensions.findIndex((item) => getDimensionName(item) === name);
}
/**
 * 针对source的map方法实现。 source[0]有可能是 number[] 或者一个object，抹平array和object迭代的判断
 * @param source
 * @param callback
 */
export function eachSource(
    source: Dataset["source"],
    callback: (
        value: string | number,
        rowIndex: number,
        colIndexOrKey: number | string
    ) => void
) {
    if (!Array.isArray(source)) {
        throw Error("source不是数组");
    }

    source.forEach(function (
        rowItem: Record<string, any> | any[],
        rowIndex: number
    ) {
        if (Array.isArray(rowItem)) {
            rowItem.forEach((item, colIndex) => {
                callback(item, rowIndex, colIndex);
            });
        } else {
            for (const key in rowItem) {
                const item = rowItem[key];
                callback(item, rowIndex, key);
            }
        }
    });
}

/**
 * 针对source的map方法实现。 source[0]有可能是 number[] 或者一个object，抹平array和object迭代的判断
 * @param source
 * @param dimensionOrColIndex dimension 或者 第几列，source为二维数组时可以用列
 * @param callback
 */
export function mapSource(
    source: Dataset["source"],
    dimensionOrColIndex: string | number | { name?: string; type?: string },
    callback: (value: string | number) => void | string | number // 如果返回，相当于是Array.map的效果
) {
    if (!Array.isArray(source)) {
        throw Error("source不是数组");
    }
    const dimensionName: string | number =
        typeof dimensionOrColIndex === "string" ||
        typeof dimensionOrColIndex === "number"
            ? dimensionOrColIndex
            : dimensionOrColIndex.name;

    // 不改变原值
    const newSource: Dataset["source"] = [];
    source.forEach(function (rowItem, index: number) {
        const returnValue = callback(rowItem[dimensionName]);
        if (Array.isArray(rowItem)) {
            // 有返回值则返回新的值
            if (returnValue !== undefined) {
                const arr = [].concat(rowItem);
                arr[dimensionName] = returnValue;
                newSource[index] = arr;
            } else {
                newSource[index] = [].concat(rowItem);
            }
            return;
        } else {
            // 有返回值则返回新的值
            if (returnValue !== undefined) {
                newSource[index] = Object.assign({}, rowItem, {
                    [dimensionName]: returnValue,
                });
            } else {
                newSource[index] = Object.assign({}, rowItem);
            }
        }
    });
    return newSource;
}

/**
 * 转为标准的dataset(包涵dimensions,source)
 * @param dataset
 */
export function get_sdt_dataset(dataset: Partial<Dataset>): SDTDataset {
    let dimensions: SDTDataset["dimensions"] = [];
    let source: SDTDataset["source"] = [];
    if (!Array.isArray(dataset.source)) {
        throw Error("dataset.source must be an array");
    }
    // key - value
    if (Array.isArray(dataset.dimensions)) {
        // const dataset = {
        //     'dimensions': ['option', 'percent'],
        //     'source': [
        //         {'option': '京东超级品牌日', 'score': 249, 'sumNumber': 287, 'value': '京东超级品牌日', 'percent': 87},
        //         {'option': '京东超级神券日', 'score': 234, 'sumNumber': 287, 'value': '京东超级神券日', 'percent': 82},
        //     ],
        // };
        dimensions = dataset.dimensions;
        source = dataset.source;
    } else if (dataset.source.length > 0 && Array.isArray(dataset.source[0])) {
        // 类似excel类型
        // const dataset = {
        //     'source': [
        //         ['option', 'percent'],
        //         ['京东超级品牌日', 2],
        //         ['京东超级品牌日2', 3]
        //     ],
        // };
        dimensions = dataset.source[0] as Dataset["dimensions"];
        source = dataset.source.slice(1);
    }

    return {
        dimensions,
        source,
    };
}
/**
 * 获取数据类型(按列)
 * @param dataset
 * @example
 * paserDataType(dataset) --> [{typt: 'string', len: 0, missing: 0}]
 */
export function paserDataType(
    dataset: Partial<Dataset>,
    transform?: (dimension: string, value: any) => string | number
) {
    const { dimensions, source } = get_sdt_dataset(dataset);
    const dimensionsType: ColTypeInfo[] = [];

    dimensions.forEach((headerName: string | any, colIndex: number) => {
        const arr = [];

        const colNameOrColIndex =
            (dataset.source as any[]).length > 0 &&
            Array.isArray(dataset.source[0])
                ? colIndex
                : headerName;
        mapSource(source, colNameOrColIndex, function (value) {
            const result = transform ? transform(headerName, value) : value;
            arr.push(result);
        });
        dimensionsType.push(type(arr));
    });

    return dimensionsType;
}

/**
 * 遍历dataset
 * @param dataset
 * @param callback
 */
export function eachDataset(
    dataset: Dataset,
    callback: (params: {
        /**
         * 当前的值
         */
        value: string | number;
        /**
         * 如果source是object，则为该object的key，数组时不存在
         *
         * source是object存在时，存在key有但dimensionName没有的情况
         */
        key?: string;
        /**
         * 第几行
         */
        rowIndex: number;
        /**
         * 第几列, 有多余的数据时为 -1
         */
        dimensionIndex?: number;
        /**
         * 当前的维度名称，通常与key一样，有多余的数据时不存在
         */
        dimensionName?: string;
    }) => void
) {
    const { dimensions, source } = get_sdt_dataset(dataset);
    if (dimensions.length === 0 || source.length === 0) {
        return;
    }
    const sourceType = Array.isArray(source[0]) ? "arr" : "obj";
    const dimensionType = typeof dimensions[0] === "string" ? "str" : "obj";

    function getDimensionName(dimension: string | DimensionObject): string {
        return dimensionType === "str"
            ? (dimension as string)
            : (dimension as DimensionObject).name;
    }
    /**
     * key为维度名称，value为colIndex，也就是dimensions的index
     */
    const dimensionsIndexMap: Record<string, number> = {};
    dimensions.forEach(function (
        currentDimension: string | DimensionObject,
        currentIndex: number
    ) {
        const name = getDimensionName(currentDimension);
        dimensionsIndexMap[name] = currentIndex;
    });

    eachSource(source, function (
        currentValue: string | number,
        rowIndex: number,
        /**
         * 可能是index，可能是key
         */
        currentIndexOrKey: string | number
    ) {
        const params = {
            value: currentValue,
            rowIndex: rowIndex,
        };
        if (sourceType === "arr") {
            Object.assign(params, {
                dimensionIndex: currentIndexOrKey,
                dimensionName: dimensions[currentIndexOrKey],
            });
        } else {
            // 为obj，可能有多余的数据(dimension没有)
            const dimensionIndex = findeDimensionIndex(
                dimensions,
                currentIndexOrKey as string
            );
            Object.assign(params, {
                key: currentIndexOrKey,
                dimensionIndex: dimensionIndex,
                dimensionName: dimensions[dimensionIndex],
            });
        }

        callback(params);
    });
}

/**
 * 每三位默认加,格式化
 * @param {string|number} x
 * @return {string}
 */
export function addCommas(value: any) {
    return format.addCommas(value);
}

/**
 * 保留几位小数
 * @param value 待处理的数值
 * @param digits 保留位数
 */
export const keepDecimalFixed = (value: number | string, digits = 0) => {
    const unit = Math.pow(10, digits);
    return Math.trunc(Number(value) * unit) / unit;
};

export function autoToFixed(value) {
    let digit = 2;
    if (value < 0.1) {
        digit = 6;
    } else if (value < 1) {
        digit = 3;
    }
    return keepDecimalFixed(value, digit);
}
/**
 * 获取min max的实际值，不使用方法，因为无法通过stringify传参
 * @param data
 */
export const getRange = function (
    min: { x: number; y: number },
    max: { x: number; y: number },
    type: string,
    dis = 1.1
) {
    if (type === "y") {
        const yMin = Math.max(min.y - dis * min.y, 0);

        return {
            min: keepDecimalFixed(yMin, 1),
            max: keepDecimalFixed(max.y + dis, 1),
        };
    }
    const xMin = Math.max(min.x - dis * min.x, 0);
    return {
        min: keepDecimalFixed(xMin, 1),
        max: keepDecimalFixed(max.x + dis, 1),
    };
};
/**
 * 按第一位数取整
 * @param number
 * @example
 * ceilNumber(1) => 10
 * ceilNumber(12) => 100
 * ceilNumber(100) => 100
 */
export function ceilNumber(number: number) {
    let bite = 0;
    if (number < 10) {
        return 10;
    }
    while (number > 1) {
        number /= 10;
        bite += 1;
    }
    const factor = Math.pow(10, bite);
    return Math.ceil(number / factor) * factor;
}
/**
 * 获取字符串长度(包含中文)
 * @param str
 * @example
 * getStringLength('好') => 2
 * getStringLength('好2') => 3
 */
export function getStringLength(str?: string) {
    if (str === undefined) {
        return 2;
    }
    return str.replace(/[\u0391-\uFFF5]/g, "aa").length;
}
