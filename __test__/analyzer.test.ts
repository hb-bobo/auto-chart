/*
 * @Author: hubo36
 * @Date: 2020-12-02 23:53
 * @LastEditors: hubo36
 * @LastEditTime: 2020-12-23 14:46
 * @FilePath: /auto-chart/__test__/analyzer.test.ts
 */
import { getValueType, findMaxOfObject } from "../src/analyzer/type";
import { utils, type } from "../src/analyzer";
import { isDateString } from "../src/analyzer/is-date";
describe("analyzer", () => {
    it("type", () => {
        // expect(type([2, 8, 30, 4])).toEqual({
        //     type: "integer",
        //     missing: 0,
        //     len: 4,
        //     maxLength: undefined,
        //     median: 16,
        //     min: 2,
        //     max: 30,
        //     avg: 11,
        //     sum: 44,
        //     unit: "",
        // });

        expect(type([{ value: "2%" }, { value: "4%" }], "value")).toEqual({
            type: "integer",
            missing: 0,
            len: 2,
            maxLength: 2,
            median: 3,
            min: 2,
            max: 4,
            avg: 3,
            sum: 6,
            unit: "%",
        });
        // expect(type([10440, 125294, 125294, 10440]).type).toBe("integer");
        // expect(type([20201027, 20201027, 20201027, 19931027]).type).toBe(
        //     "date"
        // );
        expect(
            type([
                1523,
                42209,
                88574,
                93467,
                68744,
                4040,
                71347,
                35560,
                35880,
                37297,
                37181,
                4175,
                17197,
                88552,
                72003,
                43591,
            ]).type
        ).toBe("integer");

        expect(
            type(["2010-10-27", "2010-01-27", "2010-1-27", "2010/1/27"]).type
        ).toBe("date");
    });
    it("type.getValueType", () => {
        expect(getValueType("100%")).toEqual("integer");
    });
    it("type.findMaxOfObject", () => {
        expect(findMaxOfObject({ a: 1, b: 3, c: 2 })).toEqual(["b", 3]);
    });
    it("utils.parserStringNumber", () => {
        expect(utils.parserStringNumber("-1.1%")).toEqual({
            isNumber: true,
            number: -1.1,
            abs: 1.1,
            unit: "%",
            digit: 1,
        });

        expect(utils.parserStringNumber(undefined)).toEqual({
            isNumber: false,
        });
    });
    // TODO 日期判断有误差
    it("isDateString", () => {
        // expect(isDateString("125294")).toEqual(false);
        // expect(isDateString("10440")).toEqual(false);
        expect(isDateString("2020-10-01")).toEqual(true);
    });
});
