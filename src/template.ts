import omit from "lodash/omit";
import get from "lodash/get";
import { Dataset, SDTDataset, EChartOption, ColTypeInfo } from "./interface";
import { parserStringNumber } from "./analyzer/utils";
import { paserDataType, autoToFixed, getStringLength } from "./util";
import { getAxisLabel } from "./option/axisLabel";
import { ChartType, isFieldInfo } from "./advisor";
import { datasetTransform } from "./transform";

/**
 * series不支持数组，必须是对象，内部会merge到 每个 seriesItem
 */
export interface EChartConfig extends EChartOption {
    /**
     * 数据集
     * @see — https://echarts.apache.org/en/option.html#dataset
     */
    dataset?: Dataset;
}
/**
 * 模板配置
 */
export interface TemplateConfig {
    /**
     * 与echart.setOption方法的参数一致
     */
    echartOptions: EChartConfig;
    /**
     * 额外的特殊数据
     */
    extraData?: any;
    /**
     * 数据转换器
     *
     * 一般情况下dimensions[0]为source维度名称的key,剩余的为数据的key
     *
     * @param dimension 列名/维度名称
     * @param value 当前的值
     */
    dataTransform?: (dimension: string, value: any) => string | number;
    /**
     * 数据维度的信息(一般是用来设置单位的[{}, {unit: '%'}]，第一列不设置 )
     */
    dimensionTypes?: Partial<ColTypeInfo>[];
    /**
     * 容器的宽，自动调整xAxis.axisLabel.rotate属性避免label过长重叠
     */
    width?: number;
    /**
     * 容器的高
     */
    height?: number;
    /**
     * 不想传width，可以用该属性代替
     */
    chartSize?: "big" | "middle" | "small" | "mini";
}
export interface SimplifyDimensionTypes {
    unit?: string;
}
export class TemplateBase {
    public static id: string;
    public static autoMatch: boolean;
    public static chartName: string;
    public static chartType: string;
    public chartConfig: EChartConfig = {};
    public chartAIConfig: EChartConfig = {
        xAxis: {
            axisLabel: {
                interval: 0,
            },
        },
    };
    public dimensionTypes: ColTypeInfo[];
    public dataset: SDTDataset;
    public extraData?: TemplateConfig["extraData"];
    public containerSize?: { width: number; height: number };
    public chartSize!: TemplateConfig["chartSize"];
    /**
     * 可分配平均宽
     */
    public avgWidth: number;
    /**
     * 可分配平均高
     */
    public avgHeight: number;
    constructor(option: TemplateConfig) {
        const {
            echartOptions: { dataset, ...chartOptions },
            width,
            height,
            dimensionTypes,
            dataTransform,
            extraData,
            chartSize,
        } = option;
        // this.chartConfig会合并到option中
        this.chartConfig = omit(chartOptions, "dataset");
        this.containerSize = { width, height };
        this.extraData = extraData;

        if (!dataset) {
            throw Error("dataset 必须");
        }
        if (Array.isArray(dataset)) {
            throw Error("dataset 暂时不支持数组");
        }
        if (get(this.chartConfig, "xAxis.axisLabel.interval") !== undefined) {
            this.chartAIConfig.xAxis.axisLabel.interval = get(
                this.chartConfig,
                "xAxis.axisLabel.interval"
            );
        }
        if (chartSize) {
            this.chartSize = chartSize;
        } else {
            // 根据宽度判断
            if (width && width < 380) {
                this.chartSize = "small";
            } else {
                this.chartSize = "middle";
            }
        }
        // 完成的ColTypeInfo[]
        if (dimensionTypes && isFieldInfo(dimensionTypes[0])) {
            this.dimensionTypes = dimensionTypes as ColTypeInfo[];
        } else {
            // 否则重新解析数据类型
            this.dimensionTypes = paserDataType(dataset, dataTransform);
        }

        // 传了，但不合法，需要自己解析 + 合并，如：[{unit: string}]
        if (dimensionTypes) {
            this.dimensionTypes = this.mergeDimensionTypes(
                this.dimensionTypes,
                dimensionTypes
            );
        }
        this.dataset = this.transform(dataset, dataTransform);
    }
    getOption: () => EChartOption | any;

    /**
     * 获取列的单位
     * @param index
     */
    getColUnit(index: number) {
        if (!this.dimensionTypes[index]) {
            return "";
        }
        const colType = this.dimensionTypes[index];
        return typeof colType.unit === "string" ? colType.unit : "";
    }
    getMaxValue() {
        let max = 0;
        this.dimensionTypes.forEach((item, index) => {
            if (index === 0) {
                return;
            }
            if (item.max > max) {
                max = item.max;
            }
        });
        return max;
    }
    /**
     * label渲染的角度
     * @param type
     */
    getRotate(type) {
        if (type !== "category" || this.dimensionTypes.length === 0) {
            return 0;
        }
        // 如果有则返回本身
        if (get(this.chartConfig, "xAxis.axisLabel.rotate")) {
            return get(this.chartConfig, "xAxis.axisLabel.rotate");
        }
        if (this.isBigData()) {
            this.chartAIConfig.xAxis.axisLabel.interval = "auto";
            return 0;
        }
        const width = this.containerSize.width;

        if (!width) {
            return 0;
        }
        const fontSize = getAxisLabel({}).fontSize;
        const rotate = 0;
        const maxStrLen =
            (getStringLength(this.dimensionTypes[0].maxStr) * fontSize) / 1.8;

        const avgWidth = this.getSpace().avgWidth;

        // 超出的宽度
        const overWdith = maxStrLen - avgWidth;
        // 抬起的高度
        const newLine = Math.sqrt(maxStrLen ** 2 - (avgWidth - overWdith) ** 2);

        if (overWdith > 0) {
            // 根据两直角边求对角角度
            const angle =
                (Math.atan(newLine / (avgWidth - overWdith)) * 180) / Math.PI;

            if (angle > 90) {
                this.chartAIConfig.xAxis.axisLabel.interval = "auto";
            } else {
                this.chartAIConfig.xAxis.axisLabel.interval = 0;
            }
            return angle > 90 || angle < 0 ? 90 : angle;
        } else {
            this.chartAIConfig.xAxis.axisLabel.interval = 0;
        }
        return rotate;
    }
    getSpace() {
        const width = this.containerSize.width;
        const height = this.containerSize.height;
        if (!width || !height) {
            return {
                avgWidth: 0,
                avgHeight: 0,
            };
        }

        const fontSize = getAxisLabel({}).fontSize;
        const maxTextWidth =
            getStringLength(String(this.getMaxValue())) * fontSize;
        // 数据可分配最大均宽
        const avgWidth = (width - maxTextWidth) / this.dataset.source.length;
        // 数据可分配最大均高
        const avgHeight =
            ((height - maxTextWidth) / this.dataset.source.length) *
            (this.dataset.dimensions.length - 1);
        return {
            avgWidth: avgWidth,
            avgHeight,
        };
    }
    /**
     * 合并维度类型数据
     */
    mergeDimensionTypes(
        dimensionTypes: ColTypeInfo[],
        userDimensionTypes: SimplifyDimensionTypes[]
    ) {
        return dimensionTypes.map(function (item, index) {
            if (userDimensionTypes[index]) {
                return Object.assign({}, item, userDimensionTypes[index]);
            }
            return Object.assign({}, item);
        });
    }
    transform(dataset, dataTransform?: TemplateConfig["dataTransform"]) {
        const _dataTransform = dataTransform
            ? dataTransform
            : (dimension: string, value: any) => value;
        return datasetTransform(
            dataset,
            ({ value, dimensionName, dimensionIndex }) => {
                if (dimensionIndex === 0) {
                    return value;
                }
                const { type, unit } = this.dimensionTypes[dimensionIndex];

                if (type === "integer" || type === "float") {
                    const numberInfo = parserStringNumber(
                        _dataTransform(dimensionName, value)
                    );
                    if (numberInfo.isNumber) {
                        return numberInfo.digit > 6
                            ? autoToFixed(numberInfo.number)
                            : numberInfo.number;
                    }
                    return value;
                }
                return value;
            }
        );
    }

    isBigData(axis?: "yAxis" | "xAxis") {
        // 可能没有传高和宽进来
        if (this.getSpace().avgHeight === 0 || this.getSpace().avgWidth === 0) {
            return false;
        }
        if (axis == "yAxis") {
            return this.getSpace().avgHeight < 20;
        }
        return this.getSpace().avgWidth < 20;
    }

    showDataZoom(axis?: "yAxis" | "xAxis") {
        return this.isBigData(axis); // || (this.dimensionTypes[0].type === 'date');
    }
    showSeriesLabel() {
        const width = this.containerSize.width;
        if (
            !width ||
            !this.dimensionTypes ||
            this.dimensionTypes[1] === undefined
        ) {
            return true;
        }

        const textLen = (
            String(autoToFixed(this.dimensionTypes[1].avg)) +
            this.dimensionTypes[1].unit
        ).length;

        const numberRealWidth = (textLen * getAxisLabel({}).fontSize) / 2.1;

        // 最大长度字符是否超出均宽
        const isTooLong =
            numberRealWidth >
            width /
                (this.dataset.source.length * (this.dimensionTypes.length - 1));
        if (isTooLong) {
            return false;
        }
        return true;
    }
}

export const templates: typeof TemplateBase[] = [];
const ids = {};

export function CreateTemplate(id?: string) {
    return function (
        target: typeof TemplateBase,
        key?: string,
        descriptor?: PropertyDescriptor
    ) {
        target.id = id;
        if (ids[id] !== undefined) {
            return;
        }
        ids[id] = 1;
        templates.push(target);
        return target;
    };
}

export function findChartInfo(chartType: ChartType): void | { name: string } {
    let info;
    templates.some((Template) => {
        if (chartType === Template.chartType) {
            info = {
                name: Template.chartName,
            };
            return true;
        }
        return false;
    });
    return info;
}
