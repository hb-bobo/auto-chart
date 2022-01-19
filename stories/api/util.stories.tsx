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
import ReactJson from "react-json-view";
import { util } from "src/index";

export default {
    title: "api/util",
    parameters: {
        docs: {
            page: () => (
                <>
                    <Title />
                    <Subtitle />
                    <Source
                        code={`
                        import { util } from '@jd/auto-chart`}
                    ></Source>
                    <Description />
                    <Primary />
                    <Stories />
                </>
            ),
        },
    },
};

export const Util = () => {
    const fnList = Object.keys(util);
    return (
        <ul>
            {fnList.map((name) => {
                return <li key={name}>{name}</li>;
            })}
        </ul>
    );
};

export const strEnum = () => {
    return (
        <div>
            {/* <h2>
                {`
                        strEnum(o: string[]): {
                            [x: string]: string;
                        }
                        `}
            </h2> */}
            <pre>
                util.strEnum(['bar', 'line', 'pie']) =&gt;{" "}
                {JSON.stringify(util.strEnum(["bar", "line", "pie"]))}
            </pre>
        </div>
    );
};

strEnum.story = {
    name: `strEnum`,
};

export const createArray = () => {
    return (
        <div>
            {/* <code>
                {`createArray(num: number, callback: (index: number) => void) => void[]`}
            </code> */}
            <pre>
                util.createArray(1, function (index: number) {})) =&gt;{" "}
                {JSON.stringify(
                    util.createArray(1, function (index: number) {
                        console.log(index);
                    })
                )}
            </pre>
        </div>
    );
};

createArray.story = {
    name: `createArray`,
};

export const addCommas = () => {
    return <pre>util.addCommas(12345) =&gt; {util.addCommas(12345)}</pre>;
};

addCommas.story = {
    name: "addCommas",
};
export const autoToFixed = () => {
    return (
        <div>
            <pre>util.autoToFixed(10) =&gt; {util.autoToFixed(10)}</pre>
            <pre>
                util.autoToFixed(1.111111) =&gt; {util.autoToFixed(1.111111)}
            </pre>
            <pre>util.autoToFixed(1.1) =&gt; {util.autoToFixed(1.1)}</pre>
            <pre>
                util.autoToFixed(0.011111111) =&gt;{" "}
                {util.autoToFixed(0.011111111)}
            </pre>
        </div>
    );
};
autoToFixed.story = {
    name: "autoToFixed",
};

export const ceilNumber = () => {
    return (
        <div>
            <pre>util.ceilNumber(1) =&gt; {util.ceilNumber(1)}</pre>
            <pre>util.ceilNumber(10) =&gt; {util.ceilNumber(10)}</pre>
            <pre>util.ceilNumber(99) =&gt; {util.ceilNumber(99)}</pre>
            <pre>util.ceilNumber(101) =&gt; {util.ceilNumber(101)}</pre>
        </div>
    );
};
ceilNumber.story = {
    name: "ceilNumber",
};

export const keepDecimalFixed = () => {
    return (
        <div>
            <pre>
                util.keepDecimalFixed(101, 1) =&gt;{" "}
                {util.keepDecimalFixed(101, 1)}
            </pre>
            <pre>
                util.keepDecimalFixed(101.592, 1) =&gt;{" "}
                {util.keepDecimalFixed(101.592, 1)}
            </pre>
            <pre>
                util.keepDecimalFixed(101.592, 4) =&gt;{" "}
                {util.keepDecimalFixed(101.592, 4)}
            </pre>
        </div>
    );
};
keepDecimalFixed.story = {
    name: "keepDecimalFixed",
};

export const eachDataset = () => {
    return (
        <div>
            遍历dataset
            <Source
                language="js"
                code={`
                    function eachDataset(dataset: DataSet, callback: (params: {
                    value: string | number;
                    key?: string;
                    rowIndex: number;
                    dimensionIndex?: number;
                    dimensionName?: string;
                }) => void): void`}
            ></Source>
        </div>
    );
};
eachDataset.story = {
    name: "eachDataset",
};

export const get_sdt_dataset = () => {
    return (
        <div>
            <Source
                language="js"
                code={"util.get_sdt_dataset(dataset: DataSet): DataSet"}
            ></Source>
        </div>
    );
};
get_sdt_dataset.story = {
    name: "get_sdt_dataset",
};

export const paserDataType = () => {
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
    return (
        <div>
            <ReactJson
                name="原始数据"
                src={dataset2}
                displayDataTypes={false}
            />
            <pre>util.paserDataType(dataset2) =&gt; </pre>
            <ReactJson
                name="分析结果"
                src={util.paserDataType(dataset2)}
                displayDataTypes={false}
            />
        </div>
    );
};
paserDataType.story = {
    name: "paserDataType",
};
