import React from "react";
import {
    Title,
    Subtitle,
    Description,
    Primary,
    ArgsTable,
    Stories,
    PRIMARY_STORY,
    Source,
} from "@storybook/addon-docs/blocks";

import AutoChart from "./AutoChart";
import { transform, CHART_TYPES } from "../";

export default {
    title: "React",
    component: AutoChart,
    parameters: {
        docs: {
            page: () => (
                <>
                    <Title />
                    <Subtitle />
                    <Description />
                    <Source
                        code={`
                        import { transform,  CHART_TYPES } from '@jd/auto-chart';\nimport { AutoChart } from '@jd/auto-chart/lib/react';
                    `}
                    />
                    <Primary />
                    <ArgsTable of={AutoChart} />
                    <Stories />
                </>
            ),
        },
    },
};

export const ReactAutoChart = () => {
    const dataset2 = [
        {
            name: "列名称1",
            value: 11,
            value2: 22,
        },
        {
            name: "列名称2",
            value: 55,
            value2: 33,
        },
        {
            name: "列名称4",
            value: 45,
            value2: 25,
        },
        {
            name: "列名称5",
            value: 35,
            value2: 14,
        },
    ];

    return (
        <AutoChart
            chartType={CHART_TYPES.bar}
            echartOptions={{
                dataset: transform.arrayToDataset(dataset2, {
                    name: "name",
                    value: "指标1",
                    value2: "指标2",
                }),
            }}
        ></AutoChart>
    );
};
ReactAutoChart.storyName = "指定图表类型";

export const Auto = () => {
    const dataset2 = [
        {
            name: "列名称1",
            value: 11,
            value2: 22,
        },
        {
            name: "列名称2",
            value: 55,
            value2: 33,
        },
        {
            name: "列名称4",
            value: 45,
            value2: 25,
        },
        {
            name: "列名称5",
            value: 35,
            value2: 14,
        },
    ];

    return (
        <AutoChart
            echartOptions={{
                dataset: transform.arrayToDataset(dataset2, {
                    name: "name",
                    value: "指标1",
                    value2: "指标2",
                }),
            }}
        ></AutoChart>
    );
};
Auto.storyName = "不指定图表类型";
