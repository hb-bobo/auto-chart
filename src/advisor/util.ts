import { CheckTypeParams, SDTDataset } from "../interface";

/**
 * 数据是否匹配
 * @param data
 * @param shape 数组的形状 [行数，列数] -1 为不限制
 */
export function matchDataset(data: SDTDataset, shape: [number, number]) {
    if (!data.dimensions) {
        return;
    }
    if (
        (data.dimensions.length === shape[1] || shape[1] === -1) &&
        (data.source.length === shape[0] || shape[0] === -1)
    ) {
        return true;
    }
    return false;
}

export function getNumberInfo({ dimensionTypes, extraData }: CheckTypeParams) {
    let numberCount = 0;
    let numberWidthUnitCount = 0;
    const unitMap = {};
    dimensionTypes.forEach((type, index) => {
        if (index === 0) {
            // 第一个维度作为x轴数据
            return;
        }
        if (type.type === "integer" || type.type === "float") {
            if (type.unit === "") {
                numberCount++;
            } else {
                numberWidthUnitCount++;
                if (unitMap[type.unit] === undefined) {
                    unitMap[type.unit] = 1;
                } else {
                    unitMap[type.unit]++;
                }
            }
        }
    });
    const units = Object.keys(unitMap);
    return {
        /**
         * 纯数字列数
         */
        numberCount,
        /**
         * 带符号的数字的列数
         */
        numberWidthUnitCount,
        /**
         * 数字种的符号集合(可以判断单位种类)
         */
        units,
    };
}
