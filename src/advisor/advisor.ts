import { CheckShapeParams, CheckTypeParams, ChartCheck } from "./interface";
import { getNumberInfo, matchDataset } from "./util";

export const CHART_TYPES = {
    line: "line",
    /**
     * 条形图
     */
    bar: "bar",
    /**
     * 柱状图
     */
    column_bar: "column_bar",
    /**
     * 堆叠柱状图
     */
    stacked_column_bar: "stacked_column_bar",
    /**
     * 堆叠条形图
     */
    stacked_bar: "stacked_bar",
    /**
     * 柱状图和折线图
     */
    mixed_colum_bar_line: "mixed_colum_bar_line",
    /**
     * 双轴柱状图
     */
    // multiple_y_axes_colum_bar: "multiple_y_axes_colum_bar",
    /**
     * 双轴折线图
     */
    multiple_y_axes_line: "multiple_y_axes_line",
    /**
     * 饼图
     */
    pie: "pie",
    /**
     * 环图
     */
    pie_doughnut: "pie_doughnut",
    /**
     * 散点图
     */
    scatter: "scatter",
    /**
     * 气泡图
     */
    // bubble: "bubble"
    /**
     * 四象限
     */
    scatter_four_quadrant: "scatter_four_quadrant",
    /**
     * 雷达图
     */
    radar: "radar",
};

export interface AdvisorCheck extends ChartCheck {
    type: string;
}
export class ChartChecks {
    checkers: AdvisorCheck[];
    constructor() {
        this.checkers = [];
    }
    push(advisorCheck: AdvisorCheck) {
        const index = this.checkers.findIndex(
            (item) => advisorCheck.type === item.type
        );
        if (index === -1 && advisorCheck.type) {
            this.checkers.push(advisorCheck);
        } else {
            console.warn(`${advisorCheck.type} already existed`);
        }
    }
    replace(advisorCheck: AdvisorCheck) {
        const index = this.checkers.findIndex(
            (item) => advisorCheck.type === item.type
        );
        if (index > -1 && advisorCheck.type) {
            this.checkers[index] = advisorCheck;
        }
    }
}

export const config = new ChartChecks();

/**
 * 匹配程度 1基本 2中度 3非常匹配
 */
export const matchScore = {
    basic: 1,
    moderate: 2,
    perfectly: 3,
};

config.push({
    type: CHART_TYPES.column_bar,
    checkShape({ dataset, extraData }: CheckShapeParams) {
        return matchDataset(dataset, [-1, -1]);
    },
    checkType({ dimensionTypes, extraData }: CheckTypeParams) {
        const { numberCount, numberWidthUnitCount, units } = getNumberInfo({
            dimensionTypes,
            extraData,
        });
        // 纯数字/一种单位数字
        if (
            (numberCount > 0 && units.length === 0) ||
            (numberCount === 0 && units.length === 1)
        ) {
            if (dimensionTypes[0].type === "date") {
                return matchScore.moderate;
            }
            return matchScore.basic;
        }
    },
});
config.push({
    type: CHART_TYPES.bar,
    checkShape({ dataset, extraData }: CheckShapeParams) {
        return matchDataset(dataset, [-1, -1]);
    },
    checkType({ dimensionTypes, extraData }: CheckTypeParams) {
        const { numberCount, numberWidthUnitCount, units } = getNumberInfo({
            dimensionTypes,
            extraData,
        });
        // 纯数字/一种单位数字
        if (
            (numberCount > 0 && units.length === 0) ||
            (numberCount === 0 && units.length === 1)
        ) {
            return matchScore.basic;
        }
        // 纯数字 or 特殊数字
        // return (
        //     ((numberCount > 0 && numberWidthUnitCount === 0) ||
        //         (numberCount === 0 && numberWidthUnitCount > 0)) &&
        //     units.length <= 1
        // );
    },
});
config.push({
    type: CHART_TYPES.line,
    checkShape({ dataset, extraData }: CheckShapeParams) {
        return matchDataset(dataset, [-1, -1]);
    },
    checkType({ dimensionTypes, extraData }: CheckTypeParams) {
        const { numberCount, numberWidthUnitCount, units } = getNumberInfo({
            dimensionTypes,
            extraData,
        });
        // 纯数字/一种单位数字
        if (
            (numberCount > 0 && units.length === 0) ||
            (numberCount === 0 && units.length === 1)
        ) {
            if (dimensionTypes[0].type === "date") {
                return matchScore.moderate;
            }
            return matchScore.basic;
        }
    },
});
config.push({
    type: CHART_TYPES.stacked_column_bar,
    checkShape({ dataset, extraData }: CheckShapeParams) {
        return matchDataset(dataset, [-1, -1]);
    },
    checkType({ dimensionTypes, extraData }: CheckTypeParams) {
        const { numberCount, numberWidthUnitCount, units } = getNumberInfo({
            dimensionTypes,
            extraData,
        });

        if (
            (numberCount > 0 && units.length === 0) ||
            (numberCount === 0 && units.length === 1)
        ) {
            return matchScore.basic;
        }
    },
});
config.push({
    type: CHART_TYPES.stacked_bar,
    checkShape({ dataset, extraData }: CheckShapeParams) {
        return matchDataset(dataset, [-1, -1]);
    },
    checkType({ dimensionTypes, extraData }: CheckTypeParams) {
        const { numberCount, numberWidthUnitCount, units } = getNumberInfo({
            dimensionTypes,
            extraData,
        });

        if (
            (numberCount > 0 && units.length === 0) ||
            (numberCount === 0 && units.length === 1)
        ) {
            return matchScore.basic;
        }
    },
});
config.push({
    type: CHART_TYPES.mixed_colum_bar_line,
    checkShape({ dataset, extraData }: CheckShapeParams) {
        return matchDataset(dataset, [-1, -1]);
    },
    checkType({ dimensionTypes, extraData }: CheckTypeParams) {
        const { numberCount, numberWidthUnitCount, units } = getNumberInfo({
            dimensionTypes,
            extraData,
        });
        // 两种不同符号的数字
        if (
            (numberCount > 0 && units.length === 1) ||
            (numberCount === 0 && units.length === 2)
        ) {
            return matchScore.basic;
        }
    },
});

// config.push({
//     type: CHART_TYPES.multiple_y_axes_colum_bar,
//     checkShape({ dataset, extraData }: CheckShapeParams) {
//         return matchDataset(dataset, [-1, -1]);
//     },
//     checkType({ dimensionTypes, extraData }: CheckTypeParams) {
//         const { numberCount, numberWidthUnitCount, units } = getNumberInfo({
//             dimensionTypes,
//             extraData
//         });
//         // 两种不同符号的数字
//         if (
//             (numberCount > 0 && units.length === 1) ||
//             (numberCount === 0 && units.length === 2)
//         ) {
//             return matchScore.basic;
//         }
//     }
// });
config.push({
    type: CHART_TYPES.multiple_y_axes_line,
    checkShape({ dataset, extraData }: CheckShapeParams) {
        return matchDataset(dataset, [-1, -1]);
    },
    checkType({ dimensionTypes, extraData }: CheckTypeParams) {
        const { numberCount, numberWidthUnitCount, units } = getNumberInfo({
            dimensionTypes,
            extraData,
        });
        // 两种不同符号的数字
        if (
            (numberCount > 0 && units.length === 1) ||
            (numberCount === 0 && units.length === 2)
        ) {
            return matchScore.basic;
        }
    },
});

config.push({
    type: CHART_TYPES.pie_doughnut,
    checkShape({ dataset, extraData }: CheckShapeParams) {
        return matchDataset(dataset, [-1, 2]);
    },
    checkType({ dimensionTypes, extraData }: CheckTypeParams) {
        const { numberCount, numberWidthUnitCount, units } = getNumberInfo({
            dimensionTypes,
            extraData,
        });
        // 纯数字/一种单位数字
        if (
            (numberCount > 0 && units.length === 0) ||
            (numberCount === 0 && units.length === 1)
        ) {
            // 适合种类少的数据/非日期
            if (
                dimensionTypes[0].len < 20 &&
                dimensionTypes[0].type !== "date"
            ) {
                return matchScore.basic;
            }
            return 0;
        }
    },
});

config.push({
    type: CHART_TYPES.scatter,
    checkShape({ dataset, extraData }: CheckShapeParams) {
        return (
            matchDataset(dataset, [-1, 2]) ||
            matchDataset(dataset, [-1, 3]) ||
            matchDataset(dataset, [-1, 4])
        );
    },
    checkType({ dimensionTypes, extraData }: CheckTypeParams) {
        const { numberCount, numberWidthUnitCount, units } = getNumberInfo({
            dimensionTypes,
            extraData,
        });

        if (
            ((numberCount === 2 || numberCount === 3) && units.length === 0) ||
            (numberCount === 1 && units.length === 1) ||
            (numberCount === 0 && units.length === 2)
        ) {
            return matchScore.basic;
        }
    },
});

config.push({
    type: CHART_TYPES.scatter_four_quadrant,
    checkShape({ dataset, extraData }: CheckShapeParams) {
        return (
            extraData &&
            extraData.length === 4 &&
            (matchDataset(dataset, [-1, 2]) || matchDataset(dataset, [-1, 3]))
        );
    },
    checkType({ dimensionTypes, extraData }: CheckTypeParams) {
        const { numberCount, numberWidthUnitCount, units } = getNumberInfo({
            dimensionTypes,
            extraData,
        });

        if (
            ((numberCount === 2 || numberCount === 3) && units.length === 0) ||
            (numberCount === 1 && units.length === 1) ||
            (numberCount === 0 && units.length === 2)
        ) {
            return matchScore.basic;
        }
    },
});
config.push({
    type: CHART_TYPES.radar,
    checkShape({ dataset, extraData }: CheckShapeParams) {
        return dataset.source.length >= 3 && dataset.source.length <= 13;
    },
    checkType({ dimensionTypes, extraData }: CheckTypeParams) {
        const { numberCount, numberWidthUnitCount, units } = getNumberInfo({
            dimensionTypes,
            extraData,
        });
        if (dimensionTypes[0].type === "date") {
            return 0;
        }
        if (
            (numberCount === 1 && units.length === 0) ||
            (numberCount === 0 && units.length === 1)
        ) {
            return matchScore.basic;
        }
    },
});
