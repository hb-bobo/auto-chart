import merge from "lodash/merge";
import { TemplateBase, TemplateConfig, CreateTemplate } from "../template";
import { EChartOption, Dataset } from "../interface";
import { createArray, get_sdt_dataset } from "../util";
import { simplifyDataset, col2row, datasetExchange } from "../transform";
import { CHART_TYPES } from "../advisor";
import { getGrid } from "../option/grid";
import { getAxisLabel } from "../option/axisLabel";
import { getTitle } from "../option/title";
import { getAxisLine } from "../option/axisLine";
import { getLegend } from "../option/legend";
import { barSeries } from "../option/series";
import { getTooltip } from "../option/tooltip";

interface BarConfig extends TemplateConfig {}

/**
 * 柱状图(优化版，可根据数据自动匹配)
 */
@CreateTemplate(CHART_TYPES.column_bar)
export class ColumBar extends TemplateBase {
    public static autoMatch = true;
    public static chartName = "柱状图";
    public static chartType = CHART_TYPES.column_bar;
    constructor(options: BarConfig) {
        super(options);
    }
    public getOption = (): EChartOption => {
        const { ...otherConfig } = this.chartConfig;
        const barMaxWidth = 30;
        let unit = "";
        const bigData = this.isBigData();
        const showDataZoom = this.showDataZoom();
        // const showSeriesLabel = this.showSeriesLabel();
        const dataset = this.dataset;
        const series = createArray(
            dataset.dimensions.length - 1,
            (index: number) => {
                // 默认第一个是y轴说明，第二个开始是维度类型

                if (this.getColUnit(index + 1)) {
                    unit = this.getColUnit(index + 1);
                }
                return {
                    type: "bar",
                    label: {
                        show: true, // showSeriesLabel,
                        position: "top",
                        formatter: `{@[${index + 1}]} ${unit}`,
                    },
                    barMaxWidth,
                    itemStyle: {
                        //柱状图圆角
                        borderRadius: [4, 4, 4, 4],
                        // shadowColor: 'rgba(0,0,0,0.2)',
                        // shadowBlur: 4,
                        // shadowOffsetY: 2
                    },
                };
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
            grid: getGrid({
                right: 10,
                containLabel: true,
            }),
            legend: getLegend({
                show: series.length > 1,
            }),
            xAxis: {
                type: "category",
                axisLine: getAxisLine({}),
                axisLabel: getAxisLabel({
                    rotate: this.getRotate("category"),
                    interval: this.chartAIConfig.xAxis.axisLabel.interval,
                }),
                axisTick: {
                    show: true,
                    alignWithLabel: true,
                },
            },
            yAxis: {
                type: "value",
                axisLine: getAxisLine({}),
                axisTick: {
                    show: false,
                },
                axisLabel: getAxisLabel({
                    rotate: 0,
                    formatter: `{value} ${unit}`,
                }),
                splitLine: {
                    lineStyle: {
                        type: "dashed",
                    },
                },
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
            series,
            dataset,
        };
        return merge(option, otherConfig);
    };
}
/**
 * 条形图(优化版，可根据数据自动匹配)
 */
@CreateTemplate(CHART_TYPES.bar)
export class Bar extends TemplateBase {
    public static autoMatch = true;
    public static chartName = "条形图";
    public static chartType = CHART_TYPES.bar;
    constructor(options: BarConfig) {
        super(options);
    }
    public getOption = (): EChartOption => {
        const { ...otherConfig } = this.chartConfig;
        let unit = "";
        const bigData = this.isBigData();
        const showDataZoom = this.showDataZoom("yAxis");
        const dataset = this.dataset;
        // 避免引用问题
        const series = createArray(
            dataset.dimensions.length - 1,
            (index: number) => {
                if (this.getColUnit(index + 1)) {
                    unit = this.getColUnit(index + 1);
                }
                return barSeries({
                    label: {
                        show: !bigData,
                        position: "right",
                        formatter: `{@[${index + 1}]} ${unit}`,
                    },
                    itemStyle: {
                        //柱状图圆角
                        borderRadius: [2, 2, 2, 2],
                    },
                });
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
            grid: getGrid({
                right: 14,
                containLabel: true,
            }),
            legend: getLegend({
                show: series.length > 1,
            }),
            xAxis: {
                axisLine: getAxisLine({}),
                axisLabel: {
                    formatter: `{value} ${unit}`,
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        type: "dashed",
                    },
                },
                axisTick: {
                    show: false,
                },
            },
            yAxis: {
                type: "category",
                splitLine: {
                    show: false,
                },
                axisTick: {
                    show: false,
                },
                axisLine: getAxisLine({}),
                axisLabel: getAxisLabel({
                    // interval: 0,
                    // rotate: 0,
                }),
                inverse: true,
            },
            dataZoom: showDataZoom
                ? [
                      {
                          type: "slider",
                          yAxisIndex: 0,
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

/**
 * 堆叠柱状图
 */
@CreateTemplate(CHART_TYPES.stacked_column_bar)
export class StackedColumnBar extends TemplateBase {
    public static autoMatch = true;
    public static chartName = "堆叠柱状图";
    public static chartType = CHART_TYPES.stacked_column_bar;
    constructor(options: BarConfig) {
        super(options);
    }
    public getOption = (): EChartOption => {
        const { ...otherConfig } = this.chartConfig;
        const barMaxWidth = 50;
        let unit = "";
        const bigData = this.isBigData();

        // dimensions[0] 为空无法展示数据
        const dataset = simplifyDataset(this.dataset);
        if (
            this.dataset.dimensions &&
            dataset.source[0] &&
            dataset.source[0][0] === ""
        ) {
            dataset.source[0][0] = " ";
        }

        const series = createArray(
            this.dataset.dimensions.length - 1,
            (index: number) => {
                // 默认第一个是y轴说明，第二个开始是维度类型
                unit = this.getColUnit(index + 1);
                const seriesItem = {
                    type: "bar",
                    stack: "total",
                    barMaxWidth,
                    label: {
                        show: !bigData,
                        formatter: `{@[${index + 1}]} ${unit}`,
                    },
                };

                return seriesItem;
            }
        );

        const option = {
            legend: getLegend({}),
            title: {
                left: "center",
                triggerEvent: true,
            },
            tooltip: getTooltip(this, {
                axisPointer: {
                    type: "shadow",
                },
                trigger: "axis",
            }),
            grid: getGrid({
                containLabel: true,
                right: 10,
            }),
            xAxis: {
                type: "category",
                splitLine: {
                    show: false,
                },
                axisTick: {
                    show: false,
                },
                axisLine: getAxisLine({}),
                axisLabel: getAxisLabel({
                    rotate: this.getRotate("category"),
                    interval: this.chartAIConfig.xAxis.axisLabel.interval,
                }),
            },
            yAxis: {
                axisLabel: getAxisLabel({
                    rotate: 0,
                    formatter: `{value}${unit}`,
                    // inside: true,
                    // verticalAlign: 'bottom',
                }),
                axisTick: {
                    show: false,
                },
                axisLine: getAxisLine({
                    // show: false,
                }),
                splitLine: {
                    show: true,
                    lineStyle: {
                        type: "dashed",
                    },
                },
            },
            dataZoom: this.showDataZoom()
                ? [
                      {
                          type: "slider",
                          xAxisIndex: 0,
                          filterMode: "empty",
                      },
                  ]
                : undefined,
            series,
            dataset: dataset,
        };
        return merge(option, otherConfig);
    };
}

/**
 * 堆叠条形图
 */
@CreateTemplate(CHART_TYPES.stacked_bar)
export class StackedBar extends TemplateBase {
    public static autoMatch = true;
    public static chartName = "堆叠条形图";
    public static chartType = CHART_TYPES.stacked_bar;
    constructor(options: BarConfig) {
        super(options);
    }
    public getOption = (): EChartOption => {
        const { ...otherConfig } = this.chartConfig;
        const barMaxWidth = 50;
        let unit = "";
        const bigData = this.isBigData();
        const showDataZoom = this.showDataZoom("yAxis");
        // 堆叠图需要翻转
        const dataset = this.dataset;

        // dimensions[0] 为空无法展示数据
        if (
            this.dataset.dimensions &&
            dataset.source[0] &&
            dataset.source[0][0] === ""
        ) {
            dataset.source[0][0] = " ";
        }

        const series = createArray(
            get_sdt_dataset(this.dataset).dimensions.length - 1,
            (index: number) => {
                // 默认第一个是y轴说明，第二个开始是维度类型

                unit = this.getColUnit(index + 1);
                const seriesItem = {
                    type: "bar",
                    stack: "total",
                    barMaxWidth: barMaxWidth,
                    // seriesLayoutBy: "row",
                    label: {
                        show: !bigData,
                        formatter: `{@${index + 1}} ${unit}`,
                    },
                };

                return seriesItem;
            }
        );

        const option = {
            legend: getLegend({}),
            title: {
                left: "center",
                triggerEvent: true,
            },
            tooltip: getTooltip(this, {
                axisPointer: {
                    type: "shadow",
                },
                trigger: "axis",
            }),
            grid: getGrid({
                containLabel: true,
                right: 14,
            }),
            xAxis: {
                type: "value",
                axisLabel: getAxisLabel({
                    rotate: 0,
                    formatter: `{value}${unit}`,
                }),
                axisTick: {
                    show: false,
                },
                axisLine: getAxisLine({
                    // show: false,
                }),
                splitLine: {
                    show: true,
                    lineStyle: {
                        type: "dashed",
                    },
                },
            },
            yAxis: {
                type: "category",
                splitLine: {
                    show: false,
                },
                axisTick: {
                    show: false,
                },
                axisLine: getAxisLine({}),
                axisLabel: getAxisLabel({
                    rotate: 0,
                    interval: this.chartAIConfig.xAxis.axisLabel.interval,
                }),
                inverse: true,
            },
            dataZoom: showDataZoom
                ? [
                      {
                          type: "slider",
                          yAxisIndex: 0,
                          filterMode: "empty",
                      },
                  ]
                : undefined,
            series,
            dataset: dataset,
        };
        return merge(option, otherConfig);
    };
}
