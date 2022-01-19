import merge from "lodash/merge";
import isObjectLike from "lodash/isObjectLike";
import { TemplateBase, TemplateConfig, CreateTemplate } from "../template";
import { FormatterParams } from "../interface";
import { CHART_TYPES } from "../advisor";
import { addCommas, autoToFixed, getRange } from "../util";
import { getGrid } from "../option/grid";
import { getTitle } from "../option/title";
import { getLegend } from "../option/legend";
import { getTooltip } from "../option/tooltip";
import { getAxisLabel } from "../option/axisLabel";
import { getAxisLine } from "../option/axisLine";

interface ScatterConfig extends TemplateConfig {}

@CreateTemplate(CHART_TYPES.scatter)
export class Scatter extends TemplateBase {
    public static autoMatch = true;
    public static chartName = "散点图";
    public static chartType = CHART_TYPES.scatter;
    constructor(options: ScatterConfig) {
        super(options);
    }
    public getOption = (): any => {
        const { ...otherConfig } = this.chartConfig;

        const series = [
            {
                type: "scatter",
                encode: {
                    // 把 “维度1”、映射到 X 轴：
                    x: [1],
                    // 把“维度2” 映射到 Y 轴。
                    y: [2],
                    seriesName: [0],
                    // tooltip: [0, 1, 2]
                },
            },
            // {
            //     type: 'scatter',
            //     encode: {
            //         // 把 “维度1”、映射到 X 轴：
            //         x: [4],
            //         // 把“维度2” 映射到 Y 轴。
            //         y: [5],
            //         seriesName: [3],
            //         // tooltip: [0, 1, 2]
            //     }
            // }
        ];
        const visualMap =
            this.dimensionTypes[4] === undefined
                ? undefined
                : {
                      show: false,
                      dimension: 2, // 指向第三列（列序号从 0 开始记，所以设置为 2）。
                      min: this.dimensionTypes[2].min, // 需要给出数值范围，最小数值。
                      max: this.dimensionTypes[2].max, // 需要给出数值范围，最大数值。
                      inRange: {
                          // 气泡尺寸：5 像素到 60 像素。
                          symbolSize: [5, 60],
                      },
                  };
        const option = {
            legend: getLegend({
                show: series.length > 1,
            }),
            title: {
                left: "center",
                triggerEvent: true,
            },
            tooltip: {
                axisPointer: {
                    show: true,
                    type: "cross",
                    lineStyle: {
                        type: "dashed",
                        width: 1,
                    },
                    label: {
                        backgroundColor: "#555",
                    },
                },
                formatter: (params: FormatterParams | FormatterParams[]) => {
                    if (Array.isArray(params)) {
                        return;
                    }

                    if (!params.encode) {
                        params.encode = {
                            x: 1,
                            y: 2,
                        };
                    }
                    // 数据是纯object
                    // dimensionNames: ['optin', 'value']
                    // data: {option: 'a', value: 2}
                    const strArr = [];
                    let seriesName = params.data[params.seriesName];
                    const encodeX = Array.isArray(params.encode.x)
                        ? params.encode.x[0]
                        : params.encode.x;
                    const encodeY = Array.isArray(params.encode.y)
                        ? params.encode.y[0]
                        : params.encode.y;
                    let Xkey = Array.isArray(params.dimensionNames)
                        ? params.dimensionNames[encodeX]
                        : encodeX;
                    let Ykey = Array.isArray(params.dimensionNames)
                        ? params.dimensionNames[encodeY]
                        : encodeY;
                    // 未知错误兼容
                    if (params.dimensionNames === undefined) {
                        Xkey = this.dataset.dimensions[encodeX];
                        Ykey = this.dataset.dimensions[encodeY];
                    }
                    let XValue = params.data[Xkey];
                    let YValue = params.data[Ykey];
                    // 数据是纯数组
                    // dimensionNames: ['optin', 'value']
                    // data: ['a', 1]
                    if (
                        Array.isArray(params.data) &&
                        Array.isArray(params.dimensionNames)
                    ) {
                        seriesName =
                            params.data[
                                params.dimensionNames.findIndex(
                                    (item) => item === params.seriesName
                                )
                            ];
                        XValue = params.data[encodeX];
                        YValue = params.data[encodeY];
                    }

                    strArr.push(
                        `<p>${Xkey}: ${addCommas(XValue)} ${
                            this.dimensionTypes[encodeX].unit
                        }</p>`
                    );
                    strArr.push(
                        `<p>${Ykey}: ${addCommas(YValue)} ${
                            this.dimensionTypes[encodeY].unit
                        }</p>`
                    );
                    strArr.unshift(`<p>${params.marker}${seriesName}<p>`);
                    return strArr.join("");
                },
            },
            grid: getGrid({
                containLabel: true,
                right: 0,
            }),
            xAxis: {
                type: "value",
                axisLabel: getAxisLabel({
                    rotate: 0,
                    formatter: `{value} ${this.dimensionTypes[1].unit}`,
                }),
                axisTick: {
                    show: false,
                },
                axisLine: getAxisLine({}),
                splitLine: {
                    show: true,
                    lineStyle: {
                        type: "dashed",
                    },
                },
            },
            yAxis: {
                type: "value",
                axisLabel: getAxisLabel({
                    rotate: 0,
                    formatter: `{value} ${this.dimensionTypes[2].unit}`,
                }),
                axisTick: {
                    show: false,
                },
                axisLine: getAxisLine({}),
                splitLine: {
                    show: true,
                    lineStyle: {
                        type: "dashed",
                    },
                },
            },
            series: series,
            // visualMap,
            dataset: this.dataset,
        };
        return merge(option, otherConfig);
    };
}

interface ScatterFourQuadrantConfig extends ScatterConfig {
    extraData: {
        quadrantNames?: string[];
    };
}

@CreateTemplate(CHART_TYPES.scatter_four_quadrant)
export class ScatterFourQuadrant extends TemplateBase {
    public static autoMatch = true;
    public static chartName = "四象限";
    public static chartType = CHART_TYPES.scatter_four_quadrant;

    constructor(options: ScatterFourQuadrantConfig) {
        super(options);
    }
    public getOption = (): any => {
        // const { ...otherConfig } =
        const config = this.chartConfig as ScatterFourQuadrantConfig;
        const { ...otherConfig } = config;

        const encode = {
            // 把 “维度1”、映射到 X 轴：
            x: 1,
            // 把“维度2” 映射到 Y 轴。
            y: 2,
            seriesName: 0,
            // tooltip: [0, 1, 2]
        };
        if (
            Array.isArray(this.chartConfig.series) &&
            (this.chartConfig.series[0] as any).encode
        ) {
            Object.assign(encode, (this.chartConfig.series[0] as any).encode);
        }

        const X_KEY = encode.x || encode.x[0];
        const Y_KEY = encode.y || encode.y[0];
        const hasSource = this.dimensionTypes[X_KEY] ? true : false;
        const X_MAX = hasSource ? this.dimensionTypes[X_KEY].max : 0;
        const X_MIN = hasSource ? this.dimensionTypes[X_KEY].min : 0;
        const X_AVG = hasSource ? this.dimensionTypes[X_KEY].avg : 0;

        const Y_MAX = hasSource ? this.dimensionTypes[Y_KEY].max : 0;
        const Y_MIN = hasSource ? this.dimensionTypes[Y_KEY].min : 0;
        const Y_AVG = hasSource ? this.dimensionTypes[X_KEY].avg : 0;

        // 默认x,y中位数 median
        let centerPoint = [
            autoToFixed((X_MAX + X_MIN) / 2),
            autoToFixed((Y_MAX + Y_MIN) / 2),
        ];
        let quadrantNames = ["第一象限", "第二象限", "第三象限", "第四象限"];

        if (this.extraData) {
            if (Array.isArray(this.extraData.quadrantNames)) {
                quadrantNames = this.extraData.quadrantNames;
            }
            if (this.extraData.centerPoint === "avg") {
                centerPoint = [autoToFixed(X_AVG), autoToFixed(Y_AVG)];
            }
        }
        const markAreaDataItem = {
            label: {
                show: true,
                fontStyle: "normal",
                fontWeight: "bold",
                color: "rgba(0,0,0,0.1)",
                fontSize:
                    this.containerSize.width > 460 ||
                    this.containerSize.width === undefined
                        ? 40
                        : 20,
                position: "inside",
            },
        };
        const seriesName = this.dataset.dimensions[encode.seriesName];
        const xName = this.dataset.dimensions[X_KEY];
        const yName = this.dataset.dimensions[Y_KEY];
        const getUnit = (index: number) => {
            if (!this.dimensionTypes[index]) {
                return "";
            }
            return this.dimensionTypes[index].unit;
        };
        const series = [
            {
                type: "scatter",
                encode: encode,
                label: {
                    show: true,
                    position: "right",
                    color: "#171E2C",
                    textBorderColor: "transparent",
                    formatter: this.isBigData()
                        ? `{@${seriesName}}`
                        : `{@${seriesName}}：({@${xName}}${getUnit(
                              X_KEY
                          )}，{@${yName}} ${getUnit(Y_KEY)})`,
                },
                markLine: {
                    silent: true,
                    label: {
                        position: "end",
                        fontSize: 16,
                        fontWeight: "bolder",
                    },
                    lineStyle: {
                        normal: {
                            color: "#626c91",
                            type: "solid",
                            width: 1,
                        },
                        emphasis: {
                            color: "#d9def7",
                        },
                    },
                    data: [
                        {
                            xAxis: centerPoint[0],
                            label: {
                                formatter: `{c} ${getUnit(encode.x)}`,
                            },
                        },
                        {
                            yAxis: centerPoint[1],
                            label: {
                                formatter: `{c} ${getUnit(encode.y)}`,
                            },
                        },
                    ],
                },
                markArea: {
                    silent: true,
                    itemStyle: {
                        color: "transparent",
                    },
                    label: markAreaDataItem.label,
                    data: [
                        [
                            {
                                name: quadrantNames[0],
                                coord: centerPoint,
                                // ...markAreaDataItem
                            },
                            {
                                coord: [0, Number.MAX_VALUE],
                            },
                        ],
                        [
                            {
                                name: quadrantNames[1],
                                coord: centerPoint,

                                // ...markAreaDataItem
                            },
                            {
                                coord: [Number.MAX_VALUE, Number.MAX_VALUE],
                            },
                        ],
                        [
                            {
                                name: quadrantNames[2],
                                coord: centerPoint,
                                // ...markAreaDataItem
                            },
                            {
                                coord: [0, 0],
                            },
                        ],
                        [
                            {
                                name: quadrantNames[3],
                                coord: centerPoint,
                                // ...markAreaDataItem
                            },
                            {
                                coord: [Number.MAX_VALUE, 0],
                            },
                        ],
                    ],
                },
            },
        ];

        const option = {
            legend: getLegend({
                show: series.length > 1,
            }),
            grid: getGrid({
                containLabel: true,
                left: "1%",
                right: "8%",
            }),
            title: {
                left: "center",
                triggerEvent: true,
            },
            tooltip: {
                axisPointer: {
                    show: true,
                    type: "cross",
                    lineStyle: {
                        type: "dashed",
                        width: 1,
                    },
                    label: {
                        backgroundColor: "#555",
                    },
                },
                formatter: (params: FormatterParams | FormatterParams[]) => {
                    if (
                        Array.isArray(params) ||
                        params.componentType !== "series"
                    ) {
                        return;
                    }
                    if (!params.encode) {
                        params.encode = {
                            x: encode.x,
                            y: encode.y,
                        };
                    }
                    // 数据是纯object
                    // dimensionNames: ['optin', 'value']
                    // data: {option: 'a', value: 2}
                    const strArr = [];
                    let seriesName = params.data[params.seriesName];

                    const encodeX = Array.isArray(params.encode.x)
                        ? params.encode.x[0]
                        : params.encode.x;
                    const encodeY = Array.isArray(params.encode.y)
                        ? params.encode.y[0]
                        : params.encode.y;
                    let Xkey = Array.isArray(params.dimensionNames)
                        ? params.dimensionNames[encodeX]
                        : encodeX;
                    let Ykey = Array.isArray(params.dimensionNames)
                        ? params.dimensionNames[encodeY]
                        : encodeY;
                    // 未知错误兼容
                    if (params.dimensionNames === undefined) {
                        Xkey = this.dataset.dimensions[encodeX];
                        Ykey = this.dataset.dimensions[encodeY];
                    }

                    let XValue = params.data[Xkey];
                    let YValue = params.data[Ykey];
                    // 数据是纯数组
                    // dimensionNames: ['optin', 'value']
                    // data: ['a', 1]
                    if (
                        Array.isArray(params.data) &&
                        Array.isArray(params.dimensionNames)
                    ) {
                        seriesName =
                            params.data[
                                params.dimensionNames.findIndex(
                                    (item) => item === params.seriesName
                                )
                            ];
                        XValue = params.data[encodeX];
                        YValue = params.data[encodeY];
                    }
                    strArr.push(
                        `<p>${Xkey}: ${addCommas(XValue)} ${
                            this.dimensionTypes[encodeX].unit
                        }</p>`
                    );
                    strArr.push(
                        `<p>${Ykey}: ${addCommas(YValue)} ${
                            this.dimensionTypes[encodeY].unit
                        }</p>`
                    );
                    strArr.unshift(`<p>${params.marker}${seriesName}<p>`);
                    return strArr.join("");
                },
            },

            xAxis: {
                name: this.dataset.dimensions[X_KEY],
                type: "value",
                axisLabel: getAxisLabel({
                    rotate: 0,
                    formatter: `{value} ${getUnit(encode.x)}`,
                }),
                axisTick: {
                    show: true,
                },
                axisLine: getAxisLine({}),
                splitLine: {
                    show: false,
                },
                ...getRange(
                    { x: X_MIN, y: Y_MIN },
                    { x: X_MAX, y: Y_MAX },
                    "x",
                    this.chartSize === "small" || this.chartSize === "mini"
                        ? 0
                        : undefined
                ),
            },
            yAxis: {
                name: this.dataset.dimensions[Y_KEY],
                type: "value",
                axisLabel: getAxisLabel({
                    rotate: 0,
                    formatter: `{value} ${getUnit(encode.y)}`,
                }),
                axisTick: {
                    show: true,
                },
                axisLine: getAxisLine({}),
                splitLine: {
                    show: false,
                },
                ...getRange(
                    { x: X_MIN, y: Y_MIN },
                    { x: X_MAX, y: Y_MAX },
                    "y",
                    this.chartSize === "small" || this.chartSize === "mini"
                        ? 0
                        : undefined
                ),
            },
            series: series,
            // visualMap,
            dataset: this.dataset,
        };
        return merge(option, otherConfig);
    };
}
