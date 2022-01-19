import { MergeTypes } from "./analyzer/interface";
import { EChartOption as _EChartOption } from "echarts";

export type DimensionObject = {
    name?: string;
    type?: "number" | "float" | "int" | "ordinal" | "time";
    displayName?: string;
};
/**
 * @see https://echarts.apache.org/zh/option.html#dataset
 */
export interface Dataset extends _EChartOption.Dataset {
    // dimensions?: any[] | DimensionObject[];
}
/**
 * auto-chart标准的dataset格式(不支持多个dataset)
 */
export interface SDTDataset extends _EChartOption.Dataset {
    source: any[];
}

export type EChartOption = {
    title?: any;
    color?: any;
    grid?: any;
    polar?: any;
    geo?: any;
    angleAxis?: any;
    radiusAxis?: any;
    xAxis?: any;
    yAxis?: any;
    singleAxis?: any;
    parallel?: any;
    parallelAxis?: any;
    calendar?: any;
    toolbox?: any;
    tooltip?: any;
    axisPointer?: any;
    brush?: any;
    timeline?: any;
    legend?: any;
    dataZoom?: any;
    visualMap?: any;
    graphic?: any;
    series?: any;
    [key: string]: any;
};
export type Formatter =
    | string
    | ((
          params: FormatterParams,
          ticket: string,
          callback: (ticket: string, html: string) => void
      ) => string);

export interface FormatterParams {
    componentType?: "series";
    // 系列类型
    seriesType?: string;
    // 系列在传入的 option.series 中的 index
    seriesIndex?: number;
    // 系列名称
    seriesName?: string;
    // 数据名，类目名
    name?: string;
    // 数据在传入的 data 数组中的 index
    dataIndex?: number;
    // 传入的原始数据项
    data?: Record<string, any>;
    // 传入的数据值。在多数系列下它和 data 相同。在一些系列下是 data 中的分量（如 map、radar 中）
    value?: number | Record<string, any>[] | Record<string, any>;
    // 坐标轴 encode 映射信息，
    // key 为坐标轴（如 'x' 'y' 'radius' 'angle' 等）
    // value 必然为数组，不会为 null/undefied，表示 dimension index 。
    // 其内容如：
    // {
    //     x: [2] // dimension index 为 2 的数据映射到 x 轴
    //     y: [0] // dimension index 为 0 的数据映射到 y 轴
    // }
    encode?: Record<string, any>;
    // 维度名列表
    dimensionNames?: Array<string>;
    // 数据的维度 index，如 0 或 1 或 2 ...
    // 仅在雷达图中使用。
    dimensionIndex?: number;
    // 数据图形的颜色
    color?: string;

    // 饼图的百分比
    percent?: number;
    // 标记
    marker?: string;
}

export type ColTypeInfo = MergeTypes;

export type CheckTypeParams = {
    dimensionTypes?: ColTypeInfo[];
    extraData?: any;
};
export type CheckShapeParams = { dataset?: Dataset; extraData?: any };

export interface ChartTypeOption {
    chartType: string[];
}
