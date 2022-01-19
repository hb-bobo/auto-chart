import { templates, EChartConfig, TemplateConfig } from "./template";
import { Dataset, EChartOption } from "./interface";

import { advisor, ChartType } from "./advisor";
import { paserDataType } from "./util";

/**
 * 期望分析的类型
 */
// const ANALYZE_TYPES = {
//     /**
//      * 趋势
//      */
//     trend: "trend" as "trend",
//     /**
//      * 分布
//      */
//     distribution: "distribution" as "distribution"
// };
export interface Option extends EChartConfig {
    /**
     * 额外的特殊数据
     */
    extraData?: any;
    /**
     * 分析目的
     */
    // purpose?: (keyof typeof ANALYZE_TYPES)[];
}

/**
 * 根据CHART_TYPES 获取echart option
 *
 * 部分属性会根据数据量，维度名称长度自动调整
 *
 * 尽量传容器宽度，自动调整xAxis.axisLabel.rotate属性避免label过长重叠
 * @param { ChartType } chartType
 * @param option
 */
export function getChartOption(
    chartType: string,
    option: TemplateConfig
): void | EChartOption {
    const index = templates.findIndex(function (template) {
        if (template.autoMatch && template.chartType === chartType) {
            return true;
        }
        return false;
    });

    if (templates[index]) {
        return new templates[index](option).getOption();
    }
    return undefined;
}

/**
 * 自动根据dateset获取图表类型
 *
 * 部分属性会根据数据量，维度名称长度自动调整
 *
 * 尽量传容器宽度，自动调整xAxis.axisLabel.rotate属性避免label过长重叠
 * @param option
 */
export function autoChart(
    dataset,
    {
        echartOptions,
        dataTransform,
        ...option
    }: Omit<TemplateConfig, "dimensionTypes">
) {
    const dimensionTypes = paserDataType(dataset, dataTransform);
    const chartTypes = advisor(dataset, {
        dimensionTypes,
        extraData: option.extraData,
    });
    if (chartTypes.length > 0) {
        return getChartOption(chartTypes[0], {
            echartOptions: echartOptions,
            extraData: option.extraData,
            dimensionTypes,
            ...option,
        });
    }
}
