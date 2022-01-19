/*
 * @Author: hubo36
 * @Date: 2020-12-07 21:28
 * @LastEditors: hubo36
 * @LastEditTime: 2020-12-08 17:36
 * @FilePath: /auto-chart/src/echarts/pie.ts
 */
import merge from "lodash/merge";
import { TemplateBase, TemplateConfig, CreateTemplate } from "../template";
import { EChartOption } from "../interface";
import { CHART_TYPES } from "../advisor";
import { getGrid } from "../option/grid";
import { getTitle } from "../option/title";
import { getTooltip } from "../option/tooltip";

interface PieConfig extends TemplateConfig {}

/**
 * 饼图
 */
@CreateTemplate(CHART_TYPES.pie)
export class Pie extends TemplateBase {
    public static autoMatch = true;
    public static chartName = "饼图";
    public static chartType = CHART_TYPES.pie;
    constructor(options: PieConfig) {
        super(options);
    }
    public getOption = (): EChartOption => {
        const { ...otherConfig } = this.chartConfig;

        // const inside =
        //     this.dimensionTypes[0].maxLength &&
        //     this.dimensionTypes[0].maxLength < 5
        //         ? true
        //         : false;
        const inside = false;
        const option = {
            grid: getGrid({}),
            title: getTitle({
                triggerEvent: true,
            }),
            tooltip: {
                trigger: "item",
                axisPointer: {
                    type: "line",
                },
            },

            legend: {
                orient: "vertical",
                left: "right",
                top: "middle",
            },
            series: [
                {
                    name: this.dataset.dimensions[0],
                    center: ["50%", "55%"],
                    type: "pie",
                    label: {
                        show: true,
                        position: inside ? "inside" : "outside",
                        color: inside ? "#FFF" : undefined,
                        formatter: `{b}：{@${this.dataset.dimensions[1]}} %`,
                    },
                    labelLine: {
                        lineStyle: {
                            color: "#CCC",
                        },
                    },
                    radius: ["0%", "60%"],
                },
            ],
            dataset: this.dataset,
        };
        return merge(option, otherConfig);
    };
}

/**
 * 环图
 */
@CreateTemplate(CHART_TYPES.pie_doughnut)
export class PieDoughnut extends TemplateBase {
    public static autoMatch = true;
    public static chartName = "环图";
    public static chartType = CHART_TYPES.pie_doughnut;
    public _options?: EChartOption = null;
    constructor(options: PieConfig) {
        super(options);
        this._options = new Pie(options).getOption();
    }
    public getOption = (): EChartOption => {
        return merge({}, this._options, {
            series: [
                {
                    center: ["50%", "55%"],
                    radius: ["38%", "60%"],
                },
            ],
        });
    };
}
