import merge from "lodash/merge";

const barSeriesDefaultOption: any = {
    type: "bar",
    label: {
        show: true,
    },
    barMaxWidth: 30,
    itemStyle: {
        // shadowColor: 'rgba(0,0,0,0.2)',
        // shadowBlur: 4,
        // shadowOffsetY: 2
    },
};
export function barSeries(option: any) {
    return merge({}, barSeriesDefaultOption, option);
}

const lineSeriesDefaultOption: any = {
    type: "line",
    lineStyle: {
        normal: {
            // width: 3,
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
export function lineSeries(option: any) {
    return merge({}, lineSeriesDefaultOption, option);
}
