import { matchDataset } from "../src/advisor/util";

describe("advisor", () => {
    it("util.matchDataset", () => {
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
        expect(matchDataset(dataset, [-1, 3])).toEqual(false);
        expect(matchDataset(dataset, [-1, 2])).toEqual(true);
        expect(matchDataset(dataset, [dataset.source.length, 2])).toEqual(true);
        expect(matchDataset(dataset, [dataset.source.length + 1, 2])).toEqual(
            false
        );
    });
});
