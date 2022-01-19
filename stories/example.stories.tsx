import React from "react";

import random from "lodash/random";

import isNil from "lodash/isNil";
import ReactJson from "react-json-view";
import { ChartSwitch, HotTable } from "./react-component";
import styled from "styled-components";
import { Dataset } from "src/interface";
import { simplifyDataset } from "src/transform";
import { paserDataType } from "src/util";

export default {
    title: "example/ChartSwitch",
};
const TableWrapper = styled.div`
    display: inline-block;
    overflow: auto;
    width: 400px;
    height: 200px;
`;
const ColWrapper = styled.div`
    display: inline-block;
    width: 300px;
    height: 200px;
`;
const JSONWrapper = styled.ul`
    display: inline-block;
    vertical-align: top;
`;

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
const dataset3: Dataset = {
    dimensions: ["dimension", "value"],
    source: new Array(30).fill({}).map((item, index) => {
        return {
            dimension: `维度名称id:${random(1, 100)}`,
            value: `${random(10000, 100000)}`,
        };
    }),
};
const dataset4 = {
    dimensions: ["option", "score", "score2"],
    source: new Array(34).fill({}).map((item, index) => {
        return {
            option: random(10000, 100000),
            score: random(10000, 100000),
            score2: random(10000, 100000),
            value: "京东超级神券日",
        };
    }),
};
// const dataset5 = {
//     dimensions: ["option", "percent", "percent2"],
//     source: new Array(100).fill({}).map((item, index) => {
//         return {
//             option: random(10000, 100000),
//             value: "京东超级神券日",
//             percent: `${random(-99, 99)}%`,
//             percent2: `${random(-99, 99)}日元`
//         };
//     })
// };
const datasetList = [dataset1, dataset2, dataset3, dataset4];
export const AutoChart = () => {
    const [datasetKey, setDatasetKey] = React.useState(0);
    const dataset: Dataset = datasetList[datasetKey];

    function handlePaste(data) {
        console.log(data);
    }
    return (
        <div>
            <h3>通过AutoChart实现图表切换</h3>
            {datasetList.map((item, index) => {
                return (
                    <button
                        onClick={() => {
                            setDatasetKey(index);
                        }}
                        key={index}
                    >
                        数据{index + 1}
                    </button>
                );
            })}
            <div>
                <div>
                    <TableWrapper>
                        <HotTable
                            data={
                                dataset.dimensions === undefined
                                    ? (dataset.source as any[])
                                    : simplifyDataset(dataset).source
                            }
                            afterPaste={handlePaste}
                        ></HotTable>
                    </TableWrapper>
                    <JSONWrapper>
                        <ReactJson
                            name="测试dataset"
                            src={dataset}
                            collapsed
                            displayDataTypes={false}
                        />
                    </JSONWrapper>
                </div>
                <ChartSwitch dataset={dataset} />
            </div>
        </div>
    );
};
AutoChart.story = {
    name: "AutoChart",
};

export const AutoChartTest = () => {
    const [dataset, setDataset] = React.useState<Dataset>({
        source: [
            ["维度名称", "数值"],
            ["维度1", 1],
            ["维度2", 2],
        ],
    });
    function handleTableChange(changes: any[], source: string) {
        if (Array.isArray(changes)) {
            changes.forEach(([row, prop, oldValue, newValue]) => {
                if (dataset.source[row] === undefined) {
                    dataset.source[row] = [];
                }

                dataset.source[row][prop] = newValue;

                if (isNil(dataset.source[row])) {
                    dataset.source[row];
                }
                if (isNil(dataset.source[row][prop])) {
                    delete dataset.source[row][prop];
                }
            });

            setDataset({
                source: (dataset.source as any[]).filter(
                    (row) => row[0] !== undefined
                ),
            });
        }
    }
    return (
        <div>
            <h3>auto-chart</h3>

            <div>
                <div>
                    <JSONWrapper>
                        <ReactJson
                            name="dataset源数据"
                            src={dataset}
                            collapsed
                            displayDataTypes={false}
                        />
                    </JSONWrapper>
                    <JSONWrapper>
                        <ReactJson
                            name="dataset解析结果"
                            src={paserDataType(dataset)}
                            collapsed
                            displayDataTypes={false}
                        />
                    </JSONWrapper>
                </div>
                <div style={{ position: "relative" }}>
                    <ColWrapper
                        style={{
                            float: "left",
                            overflow: "auto",
                            height: 400,
                            width: 250,
                        }}
                    >
                        <HotTable
                            data={dataset.source as any}
                            afterChange={handleTableChange}
                        ></HotTable>
                    </ColWrapper>
                    <ColWrapper
                        style={{
                            height: 500,
                            width: 600,
                            marginLeft: 60,
                        }}
                    >
                        <ChartSwitch dataset={dataset} />
                    </ColWrapper>
                </div>
            </div>
        </div>
    );
};
AutoChartTest.story = {
    name: "自由编辑数据测试",
};
