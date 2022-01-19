import merge from "lodash/merge";
import { TemplateBase, TemplateConfig, CreateTemplate } from "../template";
import { EChartOption } from "../interface";
import { createArray } from "../util";
import { CHART_TYPES } from "../advisor";
import { getGrid } from "../option/grid";
import { getAxisLabel } from "../option/axisLabel";
import { getTitle } from "../option/title";
import { getAxisLine } from "../option/axisLine";
import { getLegend } from "../option/legend";
import { getTooltip } from "../option/tooltip";
interface BarAndLineConfig extends TemplateConfig {}
/**
 * 柱线组合图(优化版，可根据数据自动匹配)
 */
@CreateTemplate(CHART_TYPES.mixed_colum_bar_line)
export class MixedColumBarLine extends TemplateBase {
    public static autoMatch = true;
    public static chartName = "柱线图";
    public static chartType = CHART_TYPES.mixed_colum_bar_line;
    constructor(options: BarAndLineConfig) {
        super(options);
    }
    public getOption = (): EChartOption => {
        const { ...otherConfig } = this.chartConfig;
        let lineUnit = "";
        let barUnit = "";
        const barMaxWidth = 30;
        const bigData = this.isBigData();
        const showDataZoom = this.showDataZoom();

        // 避免引用问题
        const series = createArray(
            this.dataset.dimensions.length - 1,
            (index: number) => {
                // 默认第一个是y轴说明，第二个开始是维度类型
                const headerName = this.dataset.dimensions[index + 1];
                // const hasNegative = this.dimensionTypes[index].min < 0;
                const seriesItem = {};

                if (
                    (this.getColUnit(index + 1) && lineUnit === "") ||
                    (lineUnit !== "" && this.getColUnit(index + 1) === lineUnit)
                ) {
                    lineUnit = this.getColUnit(index + 1);

                    Object.assign(seriesItem, {
                        type: "line",
                        yAxisIndex: 1,
                        label: {
                            show: !bigData,
                            position: "right",
                            formatter: `{@[${index + 1}]} ${lineUnit}`,
                        },
                        lineStyle: {
                            // shadowColor: 'rgba(0,0,0,0.2)',
                            // shadowBlur: 4,
                            // shadowOffsetY: 2
                        },
                        smooth: 0.4,
                    });
                } else {
                    barUnit = this.getColUnit(index + 1);
                    Object.assign(seriesItem, {
                        type: "bar",
                        yAxisIndex: 0,
                        label: {
                            show: !bigData,
                            position: "top",
                            formatter: `{@[${index + 1}]} ${barUnit}`,
                        },
                        barMaxWidth,
                        itemStyle: {
                            //柱状图圆角
                            borderRadius: [4, 4, 4, 4],
                            // shadowColor: 'rgba(0,0,0,0.2)',
                            // shadowBlur: 4,
                            // shadowOffsetY: 2
                        },
                    });
                }
                return seriesItem;
            }
        );

        const option = {
            tooltip: getTooltip(this, {
                trigger: "axis",
                axisPointer: {
                    type: "shadow",
                },
            }),
            title: getTitle({}),
            legend: getLegend({
                show: series.length > 1,
            }),
            grid: getGrid({
                containLabel: true,

                right: 0,
            }),
            xAxis: {
                type: "category",
                splitLine: { show: false },
                boundaryGap: true,
                axisLabel: getAxisLabel({
                    rotate: this.getRotate("category"),
                    interval: this.chartAIConfig.xAxis.axisLabel.interval,
                }),
                axisTick: { alignWithLabel: true },
                axisLine: getAxisLine({
                    show: true,
                }),
            },
            yAxis: [
                {
                    splitLine: {
                        show: barUnit === "",
                        lineStyle: {
                            type: "dashed",
                        },
                    },
                    axisLabel: {
                        formatter: `{value} ${barUnit}`,
                    },
                    axisTick: {
                        show: false,
                    },
                    axisLine: getAxisLine({}),
                },
                {
                    show: lineUnit !== "",
                    splitLine: {
                        show: false,
                        lineStyle: {
                            type: "dashed",
                        },
                    },
                    axisLabel: {
                        formatter: `{value} ${lineUnit}`,
                    },
                    axisTick: {
                        show: false,
                    },
                    axisLine: getAxisLine({}),
                },
            ],
            dataZoom: showDataZoom
                ? [
                      {
                          type: "slider",
                          xAxisIndex: 0,
                          filterMode: "empty",
                      },
                  ]
                : undefined,
            series,
            dataset: this.dataset,
        };

        return merge(option, otherConfig);
    };
}
/**
 * 双轴折线图(优化版，可根据数据自动匹配)
 */
@CreateTemplate(CHART_TYPES.multiple_y_axes_line)
export class MultipleYAxesLine extends TemplateBase {
    public static autoMatch = true;
    public static chartName = "双轴折线图";
    public static chartType = CHART_TYPES.multiple_y_axes_line;

    constructor(options: BarAndLineConfig) {
        super(options);
    }
    public getOption = (): EChartOption => {
        const { ...otherConfig } = this.chartConfig;
        let lineLeftUnit = "";
        let lineRightUnit = "";
        const bigData = this.isBigData();
        const showDataZoom = this.showDataZoom();
        const dataset = this.dataset;
        // 避免引用问题
        const series = createArray(
            dataset.dimensions.length - 1,
            (index: number) => {
                // 默认第一个是y轴说明，第二个开始是维度类型
                const seriesItem = {
                    type: "line",
                    lineStyle: {
                        // shadowColor: 'rgba(0,0,0,0.2)',
                        // shadowBlur: 4,
                        // shadowOffsetY: 2
                    },
                    smooth: 0.4,
                };
                if (
                    (this.getColUnit(index + 1) && lineRightUnit === "") ||
                    (lineRightUnit !== "" &&
                        this.getColUnit(index + 1) === lineRightUnit)
                ) {
                    lineRightUnit = this.getColUnit(index + 1);
                    Object.assign(seriesItem, {
                        yAxisIndex: 1,
                        label: {
                            show: !bigData,
                            position: "right",
                            formatter: `{@[${index + 1}]} ${lineRightUnit}`,
                        },
                    });
                } else {
                    lineLeftUnit = this.getColUnit(index + 1);
                    Object.assign(seriesItem, {
                        yAxisIndex: 0,
                        label: {
                            show: !bigData,
                            position: "right",
                            formatter: `{@[${index + 1}]} ${lineLeftUnit}`,
                        },
                    });
                }
                return seriesItem;
            }
        );

        const option = {
            tooltip: getTooltip(this, {
                trigger: "axis",
                axisPointer: {
                    type: "line",
                },
            }),
            title: getTitle({}),
            legend: getLegend({
                show: series.length > 1,
            }),
            grid: getGrid({
                containLabel: true,
                right: 0,
            }),
            xAxis: {
                type: "category",
                // splitLine: {'show': true},
                axisLabel: getAxisLabel({
                    rotate: this.getRotate("category"),
                    interval: this.chartAIConfig.xAxis.axisLabel.interval,
                }),
                boundaryGap: true,
                axisTick: { alignWithLabel: true },
                axisLine: getAxisLine({}),
            },
            yAxis: [
                {
                    splitLine: {
                        show: true,
                        lineStyle: {
                            type: "dashed",
                        },
                    },
                    axisLabel: {
                        formatter: `{value} ${lineLeftUnit}`,
                        // inside: true,
                        // verticalAlign: 'bottom',
                    },
                    axisTick: {
                        show: false,
                    },
                    axisLine: getAxisLine({
                        // show: false
                    }),
                },
                {
                    show: lineRightUnit !== "",
                    splitLine: {
                        show: false,
                        lineStyle: {
                            type: "dashed",
                        },
                    },
                    axisLabel: {
                        formatter: `{value} ${lineRightUnit}`,
                        // inside: true,
                        // verticalAlign: 'bottom',
                    },
                    axisTick: {
                        show: false,
                    },
                    axisLine: getAxisLine({
                        // show: false
                    }),
                },
            ],
            dataZoom: showDataZoom
                ? [
                      {
                          type: "slider",
                          xAxisIndex: 0,
                          filterMode: "empty",
                      },
                  ]
                : undefined,
            series,
            dataset,
        };

        return merge(option, otherConfig);
    };
}
