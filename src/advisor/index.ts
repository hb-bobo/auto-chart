import * as util from "./util";
import { config, CHART_TYPES, AdvisorCheck, matchScore } from "./advisor";
import { Dataset, ColTypeInfo } from "../interface";
import { get_sdt_dataset, paserDataType } from "../util";

export { util, config, CHART_TYPES, AdvisorCheck, matchScore };

export interface AdvisorOptions {
    extraData?: any;
    dimensionTypes?: ColTypeInfo[];
}
export type ChartType = keyof typeof CHART_TYPES;

/**
 * 是否是paserDataType返回的数据
 * @param data
 */
export function isFieldInfo(data) {
    return "type" in data && "len" in data && "missing" in data;
}
/**
 * 图表推荐
 * @param dataset
 */
export function advisor(
    dataset: Dataset,
    { extraData, dimensionTypes }: AdvisorOptions = {} as AdvisorOptions
): ChartType[] {
    const chartTypes: { type: ChartType; sort: number }[] = [];
    dimensionTypes = paserDataType(dataset);

    config.checkers.forEach(function (cheker) {
        if (dataset) {
            const chartType: { type: ChartType; sort: number } = {} as any;
            const isShapeMatch = cheker.checkShape({
                dataset: get_sdt_dataset(dataset),
                extraData: extraData,
            });

            if (!isShapeMatch) {
                return;
            }
            chartType.type = cheker.type as ChartType;
            const sort = cheker.checkType({
                dimensionTypes: dimensionTypes,
                extraData: extraData,
            });
            if (typeof sort === "number" && sort > 0) {
                chartType.sort = sort;
                chartTypes.push(chartType);
            }
        }
    });

    return chartTypes
        .sort(function (a, b) {
            return b.sort - a.sort;
        })
        .map((item) => item.type);
}
