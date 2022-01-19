import React from "react";
import styled from "styled-components";
import { simplifyDataset, datasetTransform } from "AUTO_CHART_SRC/transform";
import { HotTable } from "../../../react-component";

const TableWrapper = styled.div`
    display: inline-block;
    overflow: auto;
    width: 300px;
    height: 200px;
`;

const DatasetTransformDemo: React.FC<{}> = (props) => {
    const dataset = {
        dimensions: ["维度名称", "分值"],
        source: [
            {
                维度名称: "京东超级品牌日",
                分值: 3433333333,
            },
            {
                维度名称: "京东超级神券日",
                分值: 224444444,
            },
            {
                维度名称: "京东超级秒杀日",
                分值: 55444444,
            },
            {
                维度名称: "京东plus day",
                分值: 7744444,
            },
        ],
    };
    const [newDataset, setNewDataset] = React.useState<any>({} as any);
    function handleTrans() {
        const newDataset = datasetTransform(dataset, function ({
            dimensionName,
            value,
        }) {
            if (dimensionName === "分值") {
                return `${Math.round((value as number) / 10000)}万分`;
            }
            return value;
        });

        console.log(JSON.stringify(newDataset));
        setNewDataset(newDataset);
    }

    return (
        <div>
            <TableWrapper>
                <HotTable data={simplifyDataset(dataset).source}></HotTable>
            </TableWrapper>
            <button onClick={handleTrans}>转换</button>
            <div
                style={{
                    display: "inline-block",
                    height: 200,
                    width: 400,
                    overflow: "auto",
                }}
            >
                <HotTable
                    data={
                        newDataset
                            ? simplifyDataset(newDataset).source
                            : undefined
                    }
                ></HotTable>
            </div>
        </div>
    );
};
export default DatasetTransformDemo;
