import React from "react";
import styled from "styled-components";
import { simplifyDataset, datasetExchange } from "AUTO_CHART_SRC/transform";
import { HotTable } from "../../../react-component";

const TableWrapper = styled.div`
    display: inline-block;
    overflow: auto;
    width: 300px;
    height: 200px;
`;

const DatasetExchangeDemo: React.FC<{}> = (props) => {
    const dataset = {
        dimensions: ["维度名称", "百分比", "分值"],
        source: [
            {
                维度名称: "京东超级品牌日",
                百分比: 87,
                分值: 34,
            },
            {
                维度名称: "京东超级神券日",
                百分比: 82,
                分值: 22,
            },
            {
                维度名称: "京东超级秒杀日",
                百分比: 79,
                分值: 55,
            },
            {
                维度名称: "京东plus day",
                百分比: 68,
                分值: 77,
            },
        ],
    };
    const [newDataset, setNewDataset] = React.useState<any>({} as any);
    function handleTrans() {
        console.log(JSON.stringify(datasetExchange(dataset)));
        setNewDataset(datasetExchange(dataset));
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
export default DatasetExchangeDemo;
