import React from "react";
import echarts from "echarts";
import AutoChartCore, { Props as AutoChartCoreProps } from "./AutoChartCore";

export interface Props extends Omit<AutoChartCoreProps, "echarts"> {}

/**
 * auto-chart react版
 *
 * 对advisor 和 getChartOption 的封装
 *
 * 如果需要按需加载echart，请使用AutoChartCore
 * @param props
 */
const AutoChart: React.FC<Props> = (props) => {
    return <AutoChartCore echarts={echarts} {...props}></AutoChartCore>;
};

export default AutoChart;
