import { util } from "../src";

describe("auto-chart", () => {
    it("util.paserDataType", () => {
        const dataset = {
            dimensions: ["option", "percent"],
            source: [
                {
                    option: "京东超级品牌日",
                    score: 249,
                    sumNumber: 287,
                    value: "京东超级品牌日",
                    percent: 87,
                },
                {
                    option: "京东超级神券日",
                    score: 234,
                    sumNumber: 287,
                    value: "京东超级神券日",
                    percent: 82,
                },
                {
                    option: "京东超级秒杀日",
                    score: 228,
                    sumNumber: 287,
                    value: "京东超级秒杀日",
                    percent: 79,
                },
                {
                    option: "京东plus day",
                    score: 195,
                    sumNumber: 287,
                    value: "京东plus day",
                    percent: 68,
                },
            ],
        };
        const dataset2 = {
            dimensions: ["option", "percent"],
            source: [
                ["京东超级品牌日", "2%"],
                ["京东超级品牌日2", "3%"],
                ["京东超级品牌日2", "3%"],
            ],
        };
        const dataset3 = {
            source: [
                ["option", "percent"],
                ["京东超级品牌日", 2],
                ["京东超级品牌日2", 3],
            ],
        };
        // const result = {
        //     dimensions: ['option', '京东超级品牌日', '京东超级神券日', '京东超级秒杀日', '京东plus day'],
        //     source: [
        //         {option: 'percent', '京东超级品牌日': 87, '京东超级神券日': 82, '京东超级秒杀日': 79, '京东plus day': 68}
        //     ]
        // }
        // expect(util.paserDataType(dataset)).toEqual(['string', 'number']);
        expect(util.paserDataType(dataset2)).toEqual([
            {
                type: "string",
                maxStr: "京东超级品牌日2",
                maxLength: 8,
                missing: 0,
                len: 3,
            },
            {
                type: "integer",
                len: 3,
                missing: 0,
                maxLength: 2,
                min: 2,
                max: 3,
                median: 2.5,
                avg: 2.66,
                sum: 8,
                unit: "%",
            },
        ]);
        // expect(util.paserDataType(dataset3)).toEqual(['string', 'number']);
    });

    it("util.eachDataset", () => {
        const dataset1 = {
            dimensions: ["option", "percent"],
            source: [
                {
                    option: "京东超级品牌日",
                    score: 249,
                    sumNumber: 287,
                    value: "京东超级品牌日",
                    percent: "2%",
                },
                {
                    option: "京东超级神券日",
                    score: 234,
                    sumNumber: 287,
                    value: "京东超级神券日",
                    percent: "3%",
                },
            ],
        };
        const dataset1Copy = {
            dimensions: ["option", "percent"],
            source: [
                {
                    option: "京东超级品牌日",
                    score: 249,
                    sumNumber: 287,
                    value: "京东超级品牌日",
                    percent: "2%",
                },
                {
                    option: "京东超级神券日",
                    score: 234,
                    sumNumber: 287,
                    value: "京东超级神券日",
                    percent: "3%",
                },
            ],
        };
        const dataset2 = {
            dimensions: ["", "percent"],
            source: [
                ["", "2%"],
                ["", "3%"],
            ],
        };
        const dataset2Copy = {
            dimensions: ["", "percent"],
            source: [
                ["", "2%"],
                ["", "3%"],
            ],
        };
        const temp = {
            dimensions: [],
            source: [],
        };
        util.eachDataset(dataset1, function ({
            value,
            key,
            rowIndex,
            dimensionIndex,
            dimensionName,
        }) {
            // No key is an array
            if (key === undefined) {
                if (temp.source[rowIndex] === undefined) {
                    temp.source[rowIndex] = [];
                }
                temp.source[rowIndex].push(value);
            } else {
                // object
                if (temp.source[rowIndex] === undefined) {
                    temp.source[rowIndex] = {};
                }
                temp.source[rowIndex][key] = value;
            }
        });

        expect(temp.source).toEqual(dataset1Copy.source);
        const temp2 = {
            dimensions: [],
            source: [],
        };
        util.eachDataset(dataset2, function ({
            value,
            key,
            rowIndex,
            dimensionIndex,
            dimensionName,
        }) {
            // No key is an array
            if (key === undefined) {
                if (temp2.source[rowIndex] === undefined) {
                    temp2.source[rowIndex] = [];
                }
                temp2.source[rowIndex].push(value);
            } else {
                // object
                if (temp2.source[rowIndex] === undefined) {
                    temp2.source[rowIndex] = {};
                }
                temp2.source[rowIndex][key] = value;
            }
        });
        expect(temp2.source).toEqual(dataset2Copy.source);
    });

    it("util.keepDecimalFixed", () => {
        expect(util.keepDecimalFixed("0.111111", 3)).toEqual(0.111);
        expect(util.keepDecimalFixed(0.111111, 3)).toEqual(0.111);
    });
    it("util.ceilNumber", () => {
        expect(util.ceilNumber(1)).toEqual(10);
        expect(util.ceilNumber(11)).toEqual(100);
        expect(util.ceilNumber(100)).toEqual(100);
        expect(util.ceilNumber(1000)).toEqual(1000);
    });
});
