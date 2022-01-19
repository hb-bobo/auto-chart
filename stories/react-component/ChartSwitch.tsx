import React, { useState } from "react";

import { ChartType } from "../../src";
import { ChartIcon, AutoChart } from "../../src/react";

const ChartSwitch: React.FC<{ dataset: any; chartType?: ChartType }> = ({
    dataset,
    chartType: _chartType,
}) => {
    const [chartType, setChartType] = useState<ChartType>(_chartType);
    const [allChart, setAllChart] = useState<ChartType[]>([]);
    const handleChartIdClick = (_chartType: ChartType) => {
        return () => {
            console.log(_chartType);
            setChartType(_chartType);
        };
    };
    const handleAdvisorChange = (chartTypes) => {
        // console.log(chartTypes);

        setAllChart(chartTypes);
        // 默认选中第一个
        if (chartTypes[0]) {
            setChartType(chartTypes[0]);
        }
    };
    return (
        <div>
            {allChart.map((name) => {
                return (
                    <span
                        key={name}
                        onClick={handleChartIdClick(name)}
                        style={{
                            color: name === chartType ? "green" : "#000",
                            marginRight: 10,
                            cursor: "pointer",
                        }}
                        title={name}
                    >
                        <ChartIcon type={name} />
                    </span>
                );
            })}
            <AutoChart
                style={{ height: 500 }}
                chartType={chartType}
                echartOptions={{
                    dataset: dataset,
                }}
                onAdvisorChange={handleAdvisorChange}
            ></AutoChart>
            {/* {chartOption && (
                <ReactJson
                    name={`${chartType}: chartOption`}
                    src={chartOption}
                    collapsed
                    displayDataTypes={false}
                />
            )} */}
        </div>
    );
};

export default ChartSwitch;
