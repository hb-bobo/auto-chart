import { MergeTypes } from "../analyzer/interface";
import { Dataset, SDTDataset } from "../interface";
export type ColTypeInfo = MergeTypes;

export type CheckTypeParams = {
    dimensionTypes?: ColTypeInfo[];
    extraData?: any;
};
export type CheckShapeParams = { dataset?: SDTDataset; extraData?: any };

export interface ChartCheck {
    /**
     * 匹配形状
     */
    checkShape: ({ dataset, extraData }: CheckShapeParams) => boolean;
    /**
     * @returns 数字越大匹配度越高
     */
    checkType: ({
        dimensionTypes,
        extraData,
    }: CheckTypeParams) => number | undefined;
}
