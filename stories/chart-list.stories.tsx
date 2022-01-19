import React from "react";
import random from "lodash/random";
import { CHART_TYPES, templates, ChartType, util, Dataset } from "src/index";

import { AutoChart } from "../src/react";
import { datasetExchange } from "AUTO_CHART_SRC/transform";

export default {
    title: "chart-list",
};

function findChartName(chartType: ChartType) {
    let name = "";
    templates.some((Template) => {
        if (chartType === Template.chartType) {
            name = Template.chartName;
            return true;
        }
        return false;
    });
    return `${name}(${chartType})`;
}

export const PIE_DOUGHNUT = () => {
    const dataset2 = {
        dimensions: ["indicatorName", "value"],
        source: [
            { indicatorName: "京东APP", value: 85.38461538461539 },
            { indicatorName: "京东官网", value: 46.92307692307692 },
            { indicatorName: "官方公众号", value: 20.76923076923077 },
            { indicatorName: "家人/朋友/同事/同学", value: 20.76923076923077 },
            { indicatorName: "微信朋友圈广告", value: 16.153846153846153 },
            { indicatorName: "其它APP弹出的广告", value: 13.846153846153847 },
            {
                indicatorName: "视频网站（如爱奇艺等）",
                value: 11.538461538461538,
            },
            { indicatorName: "导购类网站", value: 10 },
            { indicatorName: "短视频", value: 8.461538461538462 },
            { indicatorName: "微博", value: 6.923076923076923 },
            { indicatorName: "新闻网页", value: 6.153846153846154 },
            {
                indicatorName: "路面广告（如地铁、户外大牌）",
                value: 6.153846153846154,
            },
            {
                indicatorName: "直播平台（如斗鱼、虎牙等）",
                value: 5.384615384615385,
            },
            { indicatorName: "电视广告", value: 4.615384615384616 },
            { indicatorName: "公交", value: 3.8461538461538463 },
            { indicatorName: "车载屏广告", value: 0 },
            { indicatorName: "APP应用商店", value: 0 },
        ],
    };

    return (
        <div>
            <AutoChart
                chartType={CHART_TYPES.pie_doughnut}
                echartOptions={{
                    dataset: dataset2,
                }}
            ></AutoChart>
        </div>
    );
};

PIE_DOUGHNUT.story = {
    name: findChartName(CHART_TYPES.pie_doughnut),
};

export const PIE = () => {
    const dataset2 = {
        dimensions: ["indicatorName", "value"],
        source: [
            { indicatorName: "京东APP", value: 85.38461538461539 },
            { indicatorName: "京东官网", value: 46.92307692307692 },
            { indicatorName: "官方公众号", value: 20.76923076923077 },
            { indicatorName: "家人/朋友/同事/同学", value: 20.76923076923077 },
            { indicatorName: "微信朋友圈广告", value: 16.153846153846153 },
            { indicatorName: "其它APP弹出的广告", value: 13.846153846153847 },
            {
                indicatorName: "视频网站（如爱奇艺等）",
                value: 11.538461538461538,
            },
            { indicatorName: "导购类网站", value: 10 },
            { indicatorName: "短视频", value: 8.461538461538462 },
            { indicatorName: "微博", value: 6.923076923076923 },
            { indicatorName: "新闻网页", value: 6.153846153846154 },
            {
                indicatorName: "路面广告（如地铁、户外大牌）",
                value: 6.153846153846154,
            },
            {
                indicatorName: "直播平台（如斗鱼、虎牙等）",
                value: 5.384615384615385,
            },
            { indicatorName: "电视广告", value: 4.615384615384616 },
            { indicatorName: "公交", value: 3.8461538461538463 },
            { indicatorName: "车载屏广告", value: 0 },
            { indicatorName: "APP应用商店", value: 0 },
        ],
    };

    return (
        <div>
            <AutoChart
                chartType={CHART_TYPES.pie}
                echartOptions={{
                    dataset: dataset2,
                }}
            ></AutoChart>
        </div>
    );
};
PIE.storyName = findChartName(CHART_TYPES.pie);

export const ColumnBarChart = (props: { username: string }) => {
    const dataset = {
        dimensions: ["option", "score", "score2"],
        source: new Array(17).fill({}).map((item, index) => {
            return {
                option: `2020-10-${index}`,
                score: random(1000, 10000),
                score2: random(1000, 100000),
            };
        }),
    };

    return (
        <div>
            <AutoChart
                chartType={CHART_TYPES.column_bar}
                echartOptions={{
                    dataset: dataset,
                }}
            ></AutoChart>
        </div>
    );
};

ColumnBarChart.story = {
    name: findChartName(CHART_TYPES.column_bar),
};

export const BarChart = () => {
    const dataset2 = {
        source: [
            {
                appId: "live.live.test",
                count: 87,
            },
            {
                appId: "live.live.test2",
                count: 82,
            },
            {
                appId: "live.live.test3",
                count: 79,
            },
            {
                appId: "live.live.test4",
                count: 68,
            },
        ],
        dimensions: ["appId", "count"],
    };
    // const dataset = {
    //     dimensions: ["option", "score", "score2"],
    //     source: new Array(40).fill({}).map((item, index) => {
    //         return {
    //             option: random(10000, 100000),
    //             score: random(0.1, 0.001),
    //             score2: random(0.1, 10),
    //         };
    //     }),
    // };
    return (
        <div>
            <AutoChart
                chartType={CHART_TYPES.bar}
                echartOptions={{
                    dataset: dataset2,
                }}
            ></AutoChart>
        </div>
    );
};

BarChart.story = {
    name: findChartName(CHART_TYPES.bar),
};
export const LineChart = () => {
    const dataset = {
        dimensions: ["date", "整体达成率", "提前履约率", "超时履约率"],
        source: new Array(14).fill({}).map((item, index) => {
            return {
                date: `2020-10-${index < 9 ? `0${index + 1}` : index + 1}`,
                整体达成率: Math.random(),
                提前履约率: Math.random(),
                超时履约率: Math.random(),
            };
        }),
    };
    const dataset2 = {
        dimensions: ["indicatorName", "value"],
        source: [
            { indicatorName: "京东APP", value: 85.38461538461539 },
            { indicatorName: "京东官网", value: 46.92307692307692 },
            { indicatorName: "官方公众号", value: 20.76923076923077 },
            { indicatorName: "家人/朋友/同事/同学", value: "N/A" },
            { indicatorName: "微信朋友圈广告", value: 16.153846153846153 },
            { indicatorName: "其它APP弹出的广告", value: 13.846153846153847 },
            {
                indicatorName: "视频网站（如爱奇艺等）",
                value: 11.538461538461538,
            },
            { indicatorName: "导购类网站", value: 10 },
            { indicatorName: "短视频", value: 8.461538461538462 },
            { indicatorName: "微博", value: 6.923076923076923 },
            { indicatorName: "新闻网页", value: 6.153846153846154 },
            {
                indicatorName: "路面广告（如地铁、户外大牌）",
                value: 6.153846153846154,
            },
            {
                indicatorName: "直播平台（如斗鱼、虎牙等）",
                value: 5.384615384615385,
            },
            { indicatorName: "电视广告", value: 4.615384615384616 },
            { indicatorName: "公交", value: 3.8461538461538463 },
            { indicatorName: "车载屏广告", value: 0 },
            { indicatorName: "APP应用商店", value: 0 },
        ],
    };

    return (
        <div>
            <AutoChart
                chartType={CHART_TYPES.line}
                echartOptions={{
                    dataset: dataset,
                }}
                dataTransform={function dataTransform(
                    dimension: string,
                    value: any
                ) {
                    if (typeof value == "number") {
                        return `${util.keepDecimalFixed(value * 100, 1)}%`;
                    }
                    return value;
                }}
            ></AutoChart>
        </div>
    );
};

LineChart.story = {
    name: findChartName(CHART_TYPES.line),
};

export const StackedBar = () => {
    const dataset = {
        dimensions: ["option", "score", "score2"],
        source: new Array(34).fill({}).map((item, index) => {
            return {
                option: random(10000, 100000),
                score: random(10000, 100000),
                score2: random(10000, 100000),
            };
        }),
    };
    const dataset1 = {
        dimensions: ["name", "选项1", "选项2", "选项3"],
        source: [
            { name: 1, 选项1: 0, 选项2: 0, 选项3: 0 },
            { name: 2, 选项1: 0, 选项2: 0, 选项3: 0 },
            { name: 3, 选项1: 1, 选项2: 0, 选项3: 0 },
            { name: 4, 选项1: 0, 选项2: 1, 选项3: 0 },
            { name: 5, 选项1: 0, 选项2: 0, 选项3: 0 },
            { name: 6, 选项1: 0, 选项2: 0, 选项3: 0 },
            { name: 7, 选项1: 0, 选项2: 0, 选项3: 0 },
        ],
    };

    return (
        <div>
            <AutoChart
                chartType={CHART_TYPES.stacked_bar}
                echartOptions={{
                    dataset: dataset1,
                }}
            ></AutoChart>
        </div>
    );
};

StackedBar.story = {
    name: findChartName(CHART_TYPES.stacked_bar),
};
export const StackedColumnBar = () => {
    const dataset = {
        dimensions: ["option", "score", "score2"],
        source: new Array(34).fill({}).map((item, index) => {
            return {
                option: random(10000, 100000),
                score: random(10000, 100000),
                score2: random(10000, 100000),
            };
        }),
    };
    const dataset1: Dataset = {
        dimensions: ["name", "1", "2", "3", "4", "5", "6", "7"],
        source: [
            {
                "1": 0,
                "2": 0,
                "3": 0.6666666666666666,
                "4": 1,
                "5": 0,
                "6": 0,
                "7": 0,
                name: "选项1",
            },
            {
                "1": 0,
                "2": 0,
                "3": 0.3333333333333333,
                "4": 0,
                "5": 0,
                "6": 0,
                "7": 0,
                name: "选项2",
            },
            {
                "1": 0,
                "2": 0,
                "3": 0,
                "4": 0,
                "5": 0,
                "6": 0,
                "7": 0,
                name: "选项3",
            },
        ],
    };
    return (
        <div>
            <AutoChart
                chartType={CHART_TYPES.stacked_column_bar}
                echartOptions={{
                    dataset: dataset1,
                }}
            ></AutoChart>
        </div>
    );
};

StackedColumnBar.story = {
    name: findChartName(CHART_TYPES.stacked_column_bar),
};

export const MixedColumBarLine = () => {
    const dataset = {
        dimensions: ["option", "score", "score2"],
        source: new Array(34).fill({}).map((item, index) => {
            return {
                option: `dimensionName-${random(10000, 100000)}`,
                score: random(10000, 100000),
                score2: `${random(10000, 100000)}%`,
            };
        }),
    };

    return (
        <div>
            <AutoChart
                chartType={CHART_TYPES.mixed_colum_bar_line}
                echartOptions={{
                    dataset: dataset,
                }}
            ></AutoChart>
        </div>
    );
};

MixedColumBarLine.story = {
    name: findChartName(CHART_TYPES.mixed_colum_bar_line),
};

export const MULTIPLE_Y_AXES_LINE = () => {
    const dataset = {
        dimensions: ["option", "score", "score2"],
        source: new Array(34).fill({}).map((item, index) => {
            return {
                option: `dimensionName-${random(10000, 100000)}`,
                score: random(10000, 100000),
                score2: `${random(10000, 100000)}%`,
            };
        }),
    };

    return (
        <div>
            <AutoChart
                chartType={CHART_TYPES.multiple_y_axes_line}
                echartOptions={{
                    dataset: dataset,
                }}
            ></AutoChart>
        </div>
    );
};

MULTIPLE_Y_AXES_LINE.story = {
    name: findChartName(CHART_TYPES.multiple_y_axes_line),
};

export const Scatter = () => {
    const dataset = {
        dimensions: ["name", "重要性", "满意度"],
        source: new Array(20).fill({}).map((item, index) => {
            return {
                name: `name-${random(10, 100000)}`,
                重要性: random(1, 10000),
                满意度: random(100, 10000),
            };
        }),
    };

    return (
        <div>
            <AutoChart
                chartType={CHART_TYPES.scatter}
                echartOptions={{
                    dataset: dataset,
                }}
                dimensionTypes={[{}, { unit: "%" }]}
            ></AutoChart>
        </div>
    );
};
Scatter.story = {
    name: findChartName(CHART_TYPES.scatter),
};

export const ScatterFourQuadrant = () => {
    const dataset = {
        dimensions: ["name", "重要性", "满意度"],
        source: new Array(20).fill({}).map((item, index) => {
            return {
                name: `name-${random(10, 100000)}`,
                重要性: random(1, 10000),
                满意度: random(100, 10000),
            };
        }),
    };

    return (
        <div>
            <AutoChart
                chartType={CHART_TYPES.scatter_four_quadrant}
                echartOptions={{
                    dataset: dataset,
                }}
                extraData={{
                    quadrantNames: ["一", "二", "三", "四"],
                    // 中心点设为均值
                    // centerPoint: "avg",
                }}
                dimensionTypes={[{}, { unit: "%" }]}
            ></AutoChart>
        </div>
    );
};
ScatterFourQuadrant.story = {
    name: findChartName(CHART_TYPES.scatter_four_quadrant),
};

export const Radar = () => {
    const dataset = {
        dimensions: ["seriesName", "score", "score2", "score4"],
        source: new Array(6).fill({}).map((item, index) => {
            return {
                seriesName: `index-${index}`,
                score: random(1, 100),
                score2: random(1, 100),
                score4: random(1, 100),
            };
        }),
    };
    const dataset2 = {
        dimensions: ["indicatorName", "聚划算", "拼多多", "京东秒杀"],
        source: [
            {
                indicatorName: "无提示提及率",
                聚划算: 0,
                拼多多: 16.83673469387755,
                京东秒杀: 0,
            },
            {
                indicatorName: "品牌印象力",
                聚划算: 37.9746835443038,
                拼多多: 35.8974358974359,
                京东秒杀: 80.4054054054054,
            },
            {
                indicatorName: "品牌促购力",
                聚划算: 77.21518987341773,
                拼多多: 99.82051282051282,
                京东秒杀: 81.75675675675676,
            },
            {
                indicatorName: "品牌维系力",
                聚划算: 50.81967213114754,
                拼多多: 54.54545454545454,
                京东秒杀: 80.99173553719008,
            },
            {
                indicatorName: "品牌发展力",
                聚划算: 60.75949367088608,
                拼多多: 38.46153846153847,
                京东秒杀: 33.78378378378378,
            },
        ],
    };

    return (
        <div>
            <AutoChart
                chartType={CHART_TYPES.radar}
                echartOptions={{
                    dataset: dataset2,
                }}
                dataTransform={function (field, value) {
                    if (field === "indicatorName") {
                        return value;
                    }
                    return parseInt(value) + "%";
                }}
            ></AutoChart>
        </div>
    );
};
Radar.story = {
    name: findChartName(CHART_TYPES.radar),
};
