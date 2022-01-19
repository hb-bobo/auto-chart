import merge from "lodash/merge";
import { TemplateBase, TemplateConfig, CreateTemplate } from "../template";
import { EChartOption } from "../interface";
import { CHART_TYPES } from "../advisor";
import { createArray } from "../util";
import { getGrid } from "../option/grid";
import { getAxisLabel } from "../option/axisLabel";
import { getLegend } from "../option/legend";
import { getAxisLine } from "../option/axisLine";
import { getTooltip } from "../option/tooltip";

interface LineConfig extends TemplateConfig {}

/**
 * line (优化版，可根据数据自动匹配)
 */
@CreateTemplate(CHART_TYPES.line)
export class Line extends TemplateBase {
    public static autoMatch = true;
    public static chartName = "折线图";
    public static chartType = CHART_TYPES.line;

    constructor(options: LineConfig) {
        super(options);
    }
    public getOption = (): EChartOption => {
        const { ...otherConfig } = this.chartConfig;
        let lineUnit = "";
        const dataset = this.dataset;
        const bigData = this.isBigData();
        const showDataZoom = this.showDataZoom();
        const series = createArray(
            dataset.dimensions.length - 1,
            (index: number) => {
                // 默认第一个是y轴说明，第二个开始是维度类型
                const headerName = dataset.dimensions[index + 1];

                const seriesItem = {
                    type: "line",
                    label: {
                        show: !bigData,
                        formatter: "",
                    },
                    lineStyle: {
                        normal: {
                            width: 3,
                            // shadowColor: 'rgba(0,0,0,0.2)',
                            // shadowBlur: 4,
                            // shadowOffsetY: 2
                        },
                    },
                    itemStyle: {
                        normal: {
                            borderWidth: 6,
                        },
                    },
                    smooth: 0.4,
                };
                if (this.getColUnit(index + 1)) {
                    lineUnit = this.getColUnit(index + 1);
                    // 把%去掉
                    seriesItem.label.formatter = `{@[${
                        index + 1
                    }]} ${lineUnit}`;
                } else {
                    seriesItem.label.formatter = `{@[${index + 1}]}`;
                }
                return seriesItem;
            }
        );

        const option = {
            grid: getGrid({
                right: 10,
                containLabel: true,
            }),
            legend: getLegend({
                show: series.length > 1,
            }),
            title: {
                left: "center",
                triggerEvent: true,
            },
            tooltip: getTooltip(this, {
                axisPointer: {
                    type: "line",
                },
                trigger: "axis",
            }),
            xAxis: {
                type: "category",
                splitLine: {
                    show: false,
                },
                axisLabel: getAxisLabel({
                    rotate: this.getRotate("category"),
                    interval: this.chartAIConfig.xAxis.axisLabel.interval,
                }),
                axisLine: getAxisLine({
                    // show: false
                }),
            },
            yAxis: {
                type: "value",
                splitLine: {
                    show: true,
                    lineStyle: {
                        type: "dashed",
                    },
                },
                axisTick: {
                    show: false,
                },
                axisLabel: {
                    formatter: `{value} ${lineUnit}`,
                },
                axisLine: getAxisLine({
                    // show: false
                }),
            },
            dataZoom: showDataZoom
                ? [
                      {
                          type: "slider",
                          xAxisIndex: 0,
                          filterMode: "empty",
                      },
                  ]
                : undefined,
            dataset,
            series,
        };
        return merge(option, otherConfig);
    };
}
