const defaultOption: echarts.EChartTitleOption = {
    left: "center",
    triggerEvent: true,
};
export function getTitle(option: echarts.EChartTitleOption) {
    return Object.assign({}, defaultOption, option);
}
