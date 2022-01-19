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
import random from "lodash/random";
import styled from "styled-components";
import jsBeautify from "js-beautify";
import { advisor } from "src/index";
import { simplifyDataset } from "src/transform";
import { Dataset } from "src/interface";
import { ChartIcon } from "src/react";
import { HotTable } from "../../react-component";

export default {
    title: "api/advisor",
    parameters: {
        docs: {
            page: () => (
                <>
                    <Title />
                    <Subtitle />
                    <Description />
                    <Primary />
                    <ArgsTable of={advisor} />
                    <Stories />
                </>
            ),
        },
    },
};

const TableWrapper = styled.div`
    display: inline-block;
    overflow: auto;
    width: 400px;
    height: 200px;
`;
const ChartTypeListWrapper = styled.ul`
    display: inline-block;
    vertical-align: top;
`;
const ChartTypeInfo: React.FC<{ chartTypes: string[] }> = ({ chartTypes }) => {
    return (
        <ChartTypeListWrapper>
            {chartTypes.map((name) => {
                return (
                    <li key={name}>
                        {name}:<ChartIcon type={name} />
                    </li>
                );
            })}
        </ChartTypeListWrapper>
    );
};

export const Basic = () => {
    const dataset1: Dataset = {
        dimensions: ["dimension", "百分比"],
        source: [
            {
                dimension: "京东plus day",
                百分比: "68%",
            },
            {
                dimension: "以上皆没听说过",
                百分比: "3%",
            },
            {
                dimension: "京东超级秒杀日",
                百分比: "79%",
            },
            {
                dimension: "京东超级品牌日",
                百分比: "87%",
            },
            {
                dimension: "京东超级神券日",
                百分比: "82%",
            },
        ],
    };

    const chartTypes = advisor(dataset1);

    return (
        <Source
            language="typescript"
            code={jsBeautify.js(`
            import { advisor } from "@jd/auto-chart"

            let dataset1: DataSet = {
                dimensions: ["dimension", "百分比"],
                source: [
                    {
                        dimension: "京东plus day",
                        百分比: "68%",
                    },
                    {
                        dimension: "以上皆没听说过",
                        百分比: "3%",
                    },
                    {
                        dimension: "京东超级秒杀日",
                        百分比: "79%",
                    },
                    {
                        dimension: "京东超级品牌日",
                        百分比: "87%",
                    },
                    {
                        dimension: "京东超级神券日",
                        百分比: "82%",
                    },
                ],
            };
            const chartTypes = advisor(dataset1);

            结果：${JSON.stringify(chartTypes)}
            `)}
        ></Source>
    );
};
Basic.story = {
    name: "Basic",
};

export const AdvisorTest = () => {
    let dataset1: Dataset = {
        dimensions: ["dimension", "百分比"],
        source: [
            {
                dimension: "京东plus day",
                百分比: "68%",
            },
            {
                dimension: "以上皆没听说过",
                百分比: "3%",
            },
            {
                dimension: "京东超级秒杀日",
                百分比: "79%",
            },
            {
                dimension: "京东超级品牌日",
                百分比: "87%",
            },
            {
                dimension: "京东超级神券日",
                百分比: "82%",
            },
        ],
    };
    dataset1 = simplifyDataset(dataset1);
    const chartTypes = advisor(dataset1);

    const dataset2 = {
        source: [
            ["dimension", "同比", "小计", "环比"],
            ["京东plus day", "68%", 6, "8%"],
            ["以上皆没听说过", "3%", 54, "8%"],
            ["京东超级秒杀日", "79%", 7, "8%"],
            ["京东超级品牌日", "87%", 8, "8%"],
            ["京东超级神券日", "82%", 8, "8%"],
        ],
    };

    const chartTypes2 = advisor(dataset2);

    let dataset3: Dataset = {
        dimensions: ["dimension", "value"],
        source: new Array(30).fill({}).map((item, index) => {
            return {
                dimension: `维度名称id:${random(1, 100)}`,
                value: random(10, 100000),
            };
        }),
    };

    dataset3 = simplifyDataset(dataset3);
    const chartTypes3 = advisor(dataset3);
    return (
        <div>
            <h3>单种数据</h3>
            <div>
                <TableWrapper>
                    <HotTable data={dataset1.source as any[]}></HotTable>
                </TableWrapper>
                <ChartTypeInfo chartTypes={chartTypes}></ChartTypeInfo>
            </div>
            <hr />

            <h3>单种长数据</h3>
            <div>
                <TableWrapper>
                    <HotTable data={dataset3.source as any[]}></HotTable>
                </TableWrapper>
                <ChartTypeInfo chartTypes={chartTypes3}></ChartTypeInfo>
            </div>

            <hr />

            <h3>多种数据</h3>
            <div>
                <TableWrapper>
                    <HotTable data={dataset2.source}></HotTable>
                </TableWrapper>
                <ChartTypeInfo chartTypes={chartTypes2}></ChartTypeInfo>
            </div>
        </div>
    );
};
AdvisorTest.story = {
    name: "示例",
};
