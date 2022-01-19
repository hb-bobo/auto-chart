import { eachDataset, get_sdt_dataset } from "../util";
import { Dataset, SDTDataset } from "../interface";

/**
 * dataset数据转换，handle自定义转换规则
 * @param dataset
 * @param handle
 */
export function datasetTransform(
    dataset: Dataset,
    handle?: (params: {
        dimensionName: string;
        dimensionIndex: number;
        value: string | number;
    }) => string | number
) {
    const _dataset = get_sdt_dataset(dataset);
    const d: Dataset["dimensions"] = [
        ..._dataset.dimensions,
    ] as Dataset["dimensions"];
    const s = [];
    const _handle = handle ? handle : ({ value }: any) => value;
    eachDataset(_dataset, function ({
        value,
        key,
        rowIndex,
        dimensionIndex,
        dimensionName,
    }) {
        // 避免多余的数据，必须与dimensions吻合
        if (typeof key === "string" && key !== dimensionName) {
            return;
        }
        // if (rowIndex === 0) {
        //     d.push(dimensionName);
        //     // return;
        // }
        const _value = _handle({
            dimensionName,
            dimensionIndex,
            value,
        });

        // No key is an array
        if (key === undefined) {
            if (s[rowIndex] === undefined) {
                s[rowIndex] = [];
            }
            s[rowIndex].push(_value);
        } else {
            // object
            if (s[rowIndex] === undefined) {
                s[rowIndex] = {};
            }
            s[rowIndex][key] = _value;
        }
    });
    return { dimensions: d, source: s };
}

/**
 * 将dataset横纵转换
 */
export function datasetExchange(dataset?: Dataset): SDTDataset {
    const newDataset = get_sdt_dataset(dataset);
    if (newDataset.source.length === 0) {
        return {
            dimensions: newDataset.dimensions || [],
            source: [],
        };
    }
    const _dimensions = newDataset.dimensions as string[];
    const _source = dataset.source as any[];
    const dimensions = [_dimensions[0]];
    const source: any[] = [];
    const sourceItemType = Array.isArray(newDataset.source[0]) ? "arr" : "obj";
    _source.forEach(function (row: any) {
        if (sourceItemType === "obj") {
            dimensions.push(row[dimensions[0]]);
        } else {
            dimensions.push(row[0]);
        }
    });

    _dimensions.forEach((dimensionName: string, index) => {
        if (index === 0) {
            return;
        }
        // 第一列的keyname
        const firstColKey = dimensions[0];
        // sourceItem 是 array
        if (sourceItemType === "obj") {
            const row: Record<string, any> = { [firstColKey]: dimensionName };
            _source.forEach((item: Record<string, any>) => {
                const key: string = item[firstColKey];
                row[key] = item[dimensionName];
            });
            source.push(row);
        }
        // sourceItem 是 object
        else {
            const row: (string | number)[] = [firstColKey];
            _source.forEach((item: (string | number)[], index2: number) => {
                // const key: string = item[index];
                row[index2] = item[index];
            });
            source.push(row);
        }
    });

    return {
        dimensions,
        source,
    };
}
export function col2row(dataset?: Dataset) {
    console.warn("col2row will be discarded, use a datasetExchange() instead");
    return datasetExchange(dataset);
}

/**
 * json数据改为二维简单数据(类似excel)
 *
 */
export function simplifyDataset(data?: Dataset): SDTDataset {
    // const dataset = {
    //     'dimensions': ['option', 'percent'],
    //     'source': [
    //         {'option': '京东超级品牌日', 'score': 249, 'sumNumber': 287, 'value': '京东超级品牌日', 'percent': 87},
    //         {'option': '京东超级神券日', 'score': 234, 'sumNumber': 287, 'value': '京东超级神券日', 'percent': 82},
    //         {'option': '京东超级秒杀日', 'score': 228, 'sumNumber': 287, 'value': '京东超级秒杀日', 'percent': 79},
    //         {'option': '京东plus day', 'score': 195, 'sumNumber': 287, 'value': '京东plus day', 'percent': 68},
    //         {'option': '以上皆没听说过', 'score': 9, 'sumNumber': 287, 'value': '以上皆没听说过', 'percent': 3}
    //     ],
    // };
    // const _source = [
    //     ['option', 'percent'],
    //     ['京东超级品牌日', 87],
    //     ['京东超级神券日', 82],
    //     ['京东超级秒杀日', 79],
    //     ['京东plus day', 68],
    //     ['以上皆没听说过', 3],
    // ];
    const _source = data.source as any[];
    if (!data.dimensions) {
        return data as SDTDataset;
    }
    if (typeof data.dimensions[0] !== "string") {
        throw Error("dataset.dimensions: 不支持 object[]");
    }
    // 已经是需要的格式
    if (_source[0] !== undefined && Array.isArray(_source[0])) {
        if (data.dimensions) {
            _source.unshift(data.dimensions as string[]);
        }
        return {
            source: _source,
        };
    }
    const _dimensions = data.dimensions as string[];
    const source: (string | number)[][] = [];
    source[0] = _dimensions;
    _source.forEach((item: Record<string, any>) => {
        const row: (string | number)[] = [];
        _dimensions.forEach((dimensionName: string) => {
            row.push(item[dimensionName]);
        });
        source.push(row);
    });
    return {
        source,
    };
}

/**
 * 将object[]转为dataset
 * @param source 一般数据 object[]
 * @param alias 别名 {name: '名称', value: 'xx值'} 如果有顺序要求格式为[['name', '名称'], ['value', 'xxx值']]
 * @returns { Dataset } Dataset
 */
export function arrayToDataset(
    source: Record<string, any>[],
    alias: Record<string, string> | string[][]
): Dataset {
    if (!Array.isArray(source)) {
        console.error("source格式有误, 必须为Record<string, any>[]");
    }
    const dimensions: string[] = [];
    const _source: Record<string, any>[] = [];
    const aliasIsArray = Array.isArray(alias);
    // 处理有序别名
    if (Array.isArray(alias)) {
        alias.forEach(function (aliasItem) {
            dimensions.push(aliasItem[1] || aliasItem[0]);
        });
    } else {
        // 处理无序别名
        for (const key in alias) {
            if (Object.prototype.hasOwnProperty.call(alias, key)) {
                const name = alias[key];
                dimensions.push(name);
            }
        }
    }
    // 将Key替换为dimensions的名称
    for (let i = 0; i < source.length; i++) {
        const rowData = source[i];
        const newRowData = {};
        if (aliasIsArray) {
            // 有序的情况(array)
            (alias as [string, string][]).forEach(function (aliasItem) {
                let [key, aliasName] = aliasItem;
                if (aliasName === undefined) {
                    aliasName = key;
                }
                if (rowData[key] !== undefined) {
                    newRowData[aliasName] = rowData[key];
                }
            });
            _source.push(newRowData);
        } else {
            // 无序(object)
            for (const key in alias) {
                if (Object.prototype.hasOwnProperty.call(alias, key)) {
                    const aliasName = alias[key];
                    newRowData[aliasName] = rowData[key];
                }
            }

            _source.push(newRowData);
        }
    }
    return {
        dimensions,
        source: _source,
    };
}
