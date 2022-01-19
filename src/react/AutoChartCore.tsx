import React, { useEffect, useState, useRef, useCallback } from "react";
import throttle from "lodash/throttle";
import {
    advisor,
    getChartOption,
    ChartType,
    CHART_TYPES,
    TemplateConfig,
    Dataset,
} from "../index";
import ChartBase, { Props as ChartBaseProps } from "./ChartBase";
import ChartIcon from "./ChartIcon";
import "./AutoChart.css";
import { ECharts } from "echarts";

export interface Props extends TemplateConfig {
    className?: string;
    style?: React.CSSProperties;
    /**
     * 可通过CHART_TYPES获取支持的图表类型
     */
    chartType?: string;
    /**
     * 与echart中的options一样
     */
    echartOptions: TemplateConfig["echartOptions"];
    width?: number;
    echarts: {
        init: Function;
        [x: string]: any;
    };
    getChartInstance?: ChartBaseProps["getChartInstance"];
    /**
     * 图表建议改变时
     * chartType = undefined 时且传了dataset有效
     */
    onAdvisorChange?: (advisors: ChartType[]) => void;
}

const AutoChart: React.FC<Props> = (props) => {
    const {
        chartType,
        echartOptions,
        className,
        children,
        style,
        echarts,
        onAdvisorChange,
        getChartInstance,
        ...autoChartConfig
    } = props;
    const container = useRef<HTMLDivElement>(null);
    const preDataset = useRef<Dataset>();
    const _chartOptions = useRef<ChartBaseProps["chartOptions"]>(undefined);
    const myChartRef = useRef<ECharts>();
    const [currentChartType, setCurrentChartType] = useState(chartType);
    const [containerLoaded, setContainerLoaded] = useState(false);
    const [clientWidth, setClientWidth] = useState(autoChartConfig.width || 0);

    const handleReset = useCallback(
        throttle(
            function () {
                setClientWidth(container.current?.clientWidth);
                if (myChartRef.current) {
                    myChartRef.current.resize();
                }
            },
            1000,
            { leading: false }
        ),
        []
    );

    useEffect(
        function () {
            if (chartType && CHART_TYPES[chartType] === undefined) {
                console.error(`chartType[${chartType}]不存在`);
            }
            setClientWidth(container.current?.clientWidth);
            // setClientWidth(container.current?.clientWidth);
            // eslint-disable-next-line
            initAdvisor();
            setContainerLoaded(true);
            window.addEventListener("resize", handleReset);
            return () => {
                window.removeEventListener("resize", handleReset);
            };
        },
        [handleReset]
    );
    useEffect(() => {
        if (
            echartOptions &&
            echartOptions.dataset &&
            echartOptions.dataset !== preDataset.current
        ) {
            preDataset.current = echartOptions.dataset;
            const chartTypes = advisor(echartOptions.dataset as any);

            if (chartTypes.length === 0) {
                return;
            }
            // 让业务组件做选择
            if (onAdvisorChange) {
                onAdvisorChange(chartTypes);
            }
        }
    }, [echartOptions]);
    useEffect(
        function () {
            if (chartType !== undefined) {
                setCurrentChartType(chartType);
            }
        },
        [chartType]
    );

    function initAdvisor() {
        // 数据不存在
        if (!echartOptions || !echartOptions.dataset) {
            return;
        }

        // 自动推荐流程
        if (currentChartType === undefined) {
            const chartTypes = advisor(echartOptions.dataset as any);
            if (chartTypes.length === 0) {
                return;
            }
            // 让业务组件做选择
            if (onAdvisorChange) {
                // onAdvisorChange(chartTypes);
            } else {
                // 默认选第一个
                setCurrentChartType(chartTypes[0]);
            }
        }
    }
    function renderContent() {
        if (!echartOptions.dataset || !currentChartType || !containerLoaded) {
            return (
                <div
                    className="chart-skeleton"
                    style={{
                        height: style?.height || "100%",
                    }}
                >
                    <ChartIcon
                        className="chart-skeleton-icon"
                        type={currentChartType || CHART_TYPES.column_bar}
                    ></ChartIcon>
                </div>
            );
        }

        // 确定图表的类型
        if (currentChartType in CHART_TYPES) {
            _chartOptions.current = getChartOption(currentChartType, {
                echartOptions: {
                    // 设置默认颜色
                    // color: DEFAULT_COLORS,
                    ...echartOptions,
                },
                ...autoChartConfig,
                width: clientWidth || container.current?.clientWidth,
                height: container.current?.clientHeight,
            });
        } else {
            console.error(`chartType: ${currentChartType} 不存在`);
        }
        return (
            <ChartBase
                echarts={echarts}
                chartOptions={_chartOptions.current}
                isOptionNotMerge
                getChartInstance={(chartInstance) => {
                    getChartInstance && getChartInstance(chartInstance);
                    myChartRef.current = chartInstance;
                }}
            ></ChartBase>
        );
    }

    return (
        <div
            className={`auto-chart ${className || ""}`}
            ref={container}
            style={style}
        >
            {renderContent()}
        </div>
    );
};

export default AutoChart;
