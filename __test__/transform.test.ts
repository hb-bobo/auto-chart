import {
    arrayToDataset,
    datasetExchange,
    datasetTransform,
} from "../src/transform";

describe("transform", () => {
    it("datasetExchange", () => {
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
        const target = {
            dimensions: [
                "option",
                "京东超级品牌日",
                "京东超级神券日",
                "京东超级秒杀日",
                "京东plus day",
            ],
            source: [
                {
                    option: "percent",
                    京东超级品牌日: 87,
                    京东超级神券日: 82,
                    京东超级秒杀日: 79,
                    "京东plus day": 68,
                },
            ],
        };

        expect(datasetExchange(dataset)).toEqual(target);

        const dataset2 = {
            dimensions: ["option", "percent"],
            source: [
                ["京东超级品牌日", 249],
                ["京东超级神券日", 234],
                ["京东超级秒杀日", 228],
                ["京东plus day", 195],
            ],
        };
        const target2 = {
            dimensions: [
                "option",
                "京东超级品牌日",
                "京东超级神券日",
                "京东超级秒杀日",
                "京东plus day",
            ],
            source: [["percent", 249, 234, 228, 195]],
        };
        const dataset3 = {
            source: [
                ["option", "percent"],
                ["京东超级品牌日", 249],
                ["京东超级神券日", 234],
                ["京东超级秒杀日", 228],
                ["京东plus day", 195],
            ],
        };

        expect(datasetExchange(dataset3).source).toEqual(target2.source);
    });

    it("arrayToDataset", () => {
        const source = [
            {
                name: "维度1",
                value: 1,
                value2: 2,
            },
            {
                name: "维度2",
                value: 1,
                value2: 2,
            },
            {
                name: "维度3",
                value: 1,
                value2: 2,
            },
        ];
        const alias = {
            name: "name",
            value: "攻击力",
            value2: "耐久力",
        };

        expect(arrayToDataset(source, alias)).toEqual({
            dimensions: ["name", "攻击力", "耐久力"],
            source: [
                { name: "维度1", 攻击力: 1, 耐久力: 2 },
                { name: "维度2", 攻击力: 1, 耐久力: 2 },
                { name: "维度3", 攻击力: 1, 耐久力: 2 },
            ],
        });

        // 维度有序测试
        const source2 = [
            {
                name: "维度1",
                value: 1,
                value2: 2,
            },
            {
                name: "维度2",
                value: 1,
                value2: 2,
            },
            {
                name: "维度3",
                value: 1,
                value2: 2,
            },
        ];
        const alias2 = [["name", "名称"], ["value2"], ["value", "攻击力"]];

        expect(arrayToDataset(source2, alias2)).toEqual({
            dimensions: ["名称", "value2", "攻击力"],
            source: [
                { 名称: "维度1", 攻击力: 1, value2: 2 },
                { 名称: "维度2", 攻击力: 1, value2: 2 },
                { 名称: "维度3", 攻击力: 1, value2: 2 },
            ],
        });
    });

    it("datasetTransform", () => {
        const dataset1 = {
            dimensions: ["option", "percent"],
            source: [
                {
                    option: "京东超级品牌日",
                    score: 249,
                    percent: 2,
                },
                {
                    option: "京东超级神券日",
                    score: 234,
                    percent: 2,
                },
            ],
        };

        const res1 = {
            dimensions: ["option", "percent"],
            source: [
                {
                    option: "京东超级品牌日",
                    // score: "249%",
                    percent: `20%`,
                },
                {
                    option: "京东超级神券日",
                    // score: "234%",
                    percent: `20%`,
                },
            ],
        };
        const newDataset = datasetTransform(dataset1, function ({
            dimensionName,
            value,
        }) {
            if (dimensionName === "percent") {
                return `${(value as number) * 10}%`;
            }
            return value;
        });

        expect(newDataset).toEqual(res1);
    });
});
