import "./echarts";
export * from "./interface";
import { autoChart, getChartOption } from "./auto-chart";
import * as util from "./util";
import * as transform from "./transform";
import { CHART_TYPES as _CHART_TYPES, advisor, ChartType } from "./advisor";
export { type } from "./analyzer";
export {
    CreateTemplate,
    TemplateBase,
    templates,
    TemplateConfig,
} from "./template";

export const CHART_TYPES = _CHART_TYPES as Record<ChartType, ChartType>;

export { advisor, autoChart, getChartOption, transform, util, ChartType };
