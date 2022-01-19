/*
 * @Author: hubo36
 * @Date: 2020-12-07 21:28
 * @LastEditors: hubo36
 * @LastEditTime: 2020-12-08 11:36
 * @FilePath: /auto-chart/src/templates/radar.ts
 */
import merge from "lodash/merge";
import { TemplateBase, TemplateConfig, CreateTemplate } from "../template";
import { FormatterParams } from "../interface";
import { CHART_TYPES } from "../advisor";
import { addCommas, ceilNumber, eachDataset } from "../util";
import { getGrid } from "../option/grid";
import { getLegend } from "../option/legend";

interface RadarConfig extends TemplateConfig {}

@CreateTemplate(CHART_TYPES.radar)
export class Radar extends TemplateBase {
    public static autoMatch = true;
    public static chartName = "雷达图";
    public static chartType = CHART_TYPES.radar;
    constructor(options: RadarConfig) {
        super(options);
    }
    public getOption = (): any => {
        const { ...otherConfig } = this.chartConfig;
        const small = this.chartSize === "small" || this.chartSize === "mini";
        let max = 0;
        this.dimensionTypes.forEach(function (info) {
            if (info.max && info.max > max) {
                max = info.max;
            }
        });

        max = ceilNumber(max);

        const indicator = [];
        const seriesData = [];
        eachDataset(
            this.dataset,
            ({ value, key, rowIndex, dimensionIndex, dimensionName }) => {
                // 取第一列的名称
                if (dimensionIndex === 0) {
                    indicator.push({
                        name: value,
                        max: max,
                    });
                    return;
                }
                // 有可能有多余的干扰数据
                if (key !== dimensionName) {
                    return;
                }
                // 按列取数
                if (seriesData[dimensionIndex - 1] === undefined) {
                    seriesData[dimensionIndex - 1] = {
                        name: dimensionName,
                        label: {
                            formatter: `{c} ${this.dimensionTypes[dimensionIndex].unit}`,
                        },
                    };
                }
                if (seriesData[dimensionIndex - 1].value === undefined) {
                    seriesData[dimensionIndex - 1].value = [];
                }
                seriesData[dimensionIndex - 1].value.push(value);
            }
        );

        const option = {
            title: {
                left: "center",
                triggerEvent: true,
            },
            tooltip: {
                show: this.dimensionTypes.length > 2,
                formatter: (params: FormatterParams) => {
                    if (!Array.isArray(params.dimensionNames)) {
                        return "";
                    }
                    const list = [];
                    if (Array.isArray(params.value)) {
                        params.value.forEach((value, index) => {
                            if (index === 0) {
                                return;
                            }
                            const unit = this.getColUnit(
                                params.seriesIndex + 1
                            );
                            list.push(
                                `<p> ${indicator[index].name}: ${addCommas(
                                    value
                                )} ${unit ? unit : ""}</p>`
                            );
                        });
                    }
                    list.unshift(`<p>${params.data.name}<p>`);
                    return `${list.join("")}`;
                },
            },
            grid: getGrid({
                containLabel: true,
                right: 0,
            }),
            legend: getLegend({
                show: this.dataset.dimensions.length > 2,
            }),
            radar: {
                radius: "58%",
                name: {
                    rich: {
                        name: {
                            color: "#666666",
                            fontSize: small ? 10 : 14,
                            fontWeight: "bold",
                        },
                        value: {
                            color: "#008CFF",
                            fontSize: small ? 12 : 16,
                            align: "center",
                            fontWeight: "bold",
                        },
                    },
                    textStyle: {
                        fontSize: small ? 12 : 14,
                    },
                },
                splitArea: {
                    show: true,
                    areaStyle: {
                        color: "#F5FBFF",
                    },
                },
                indicator: indicator,
            },
            series: [
                {
                    type: "radar",
                    name: "雷达图",
                    data: seriesData,
                    symbol: this.dataset.source.length > 1 ? "circle" : "none",
                    lineStyle: {
                        type: "solid",
                        opacity: 1,
                    },
                    label: {
                        show:
                            this.dataset.dimensions.length < 5 &&
                            this.dataset.source.length < 14,
                        fontSize: small ? 12 : 14,
                        fontWeight: "bold",
                    },
                    areaStyle:
                        this.dataset.source.length === 1
                            ? {
                                  //   color: "#3080f2",
                                  opacity: 0.7,
                              }
                            : undefined,
                },
            ],

            // dataset: this.dataset
        };
        return merge(option, otherConfig);
    };
}
