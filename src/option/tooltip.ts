/*
 * @Author: hubo36
 * @Date: 2020-12-02 23:53
 * @LastEditors: hubo36
 * @LastEditTime: 2020-12-21 20:57
 * @FilePath: /auto-chart/src/option/tooltip.ts
 */
import isObjectLike from "lodash/isObjectLike";
import { Formatter, FormatterParams } from "../interface";
import { addCommas } from "../util";
import { TemplateBase } from "../template";
export interface ToolTipOption {
    show?: boolean;
    trigger?: "item" | "axis" | "none";
    triggerOn?: "mousemove" | "click" | "none" | "mousemove" | "click";
    axisPointer: {
        type?: "line" | "shadow" | "none" | "cross";
        axis?: "auto";
        [x: string]: any;
    };
    formatter: Formatter;
    backgroundColor?: string;
}
const defaultOption: Partial<ToolTipOption> = {
    axisPointer: {
        shadowStyle: {
            color: "rgba(150,150,150,0.0)",
            opacity: 0.3,
        },
    },
};
export function getTooltip(
    instance: TemplateBase,
    option: Partial<ToolTipOption>
) {
    return Object.assign(
        {},
        defaultOption,
        {
            formatter(params: FormatterParams | FormatterParams[]) {
                let arr: FormatterParams[] = [];
                if (!Array.isArray(params)) {
                    arr = [params];
                } else {
                    arr = params;
                }
                let xName;
                const strArr = arr.map((item) => {
                    xName = item.name;
                    let value;
                    if (item.seriesName === "") {
                        return;
                    }
                    if (
                        Array.isArray(item.data) &&
                        typeof item.seriesIndex === "number"
                    ) {
                        value = item.data[item.seriesIndex + 1];
                    } else if (isObjectLike(item.data) && item.seriesName) {
                        value = item.data[item.seriesName];
                    } else {
                        value = item.value;
                    }
                    const unit = instance.getColUnit(item.seriesIndex + 1);

                    return `${item.marker}${item.seriesName}: ${addCommas(
                        value
                    )} ${unit ? unit : ""}<br>`;
                });
                strArr.unshift(`${xName}<br>`);
                return strArr.join("");
            },
        },
        option
    );
}
