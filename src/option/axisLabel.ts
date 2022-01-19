/*
 * @Author: hubo36
 * @Date: 2020-12-02 23:53
 * @LastEditors: hubo36
 * @LastEditTime: 2020-12-21 13:11
 * @FilePath: /auto-chart/src/option/axisLabel.ts
 */
const defaultOption: echarts.EChartOption.BasicComponents.CartesianAxis.Label = {
    // rotate: 0,
    fontSize: 11,
    color: "#999999",
};
export function getAxisLabel(
    option: echarts.EChartOption.BasicComponents.CartesianAxis.Label
) {
    return Object.assign({}, defaultOption, option);
}
