import React, { useEffect, useRef } from "react";
import { ECharts, EChartOption } from "echarts";
import "./ChartBase.css";

export interface Props {
    style?: React.CSSProperties;
    /**
     * 图表配置数据
     */
    chartOptions?: EChartOption | void;
    /**
     * 是否不合并配置数据，默认false
     */
    isOptionNotMerge?: boolean;
    initOps?: {
        devicePixelRatio?: number;
        renderer?: string;
        width?: number | string;
        height?: number | string;
    };
    echarts: any;
    /**
     * 获取当前echart实例
     */
    getChartInstance?: (echartsInstance: ECharts) => void;
    /**
     * 数据加载中
     */
    dataLoading?: boolean;
}

const ChartBase: React.FC<Props> = (props) => {
    const {
        chartOptions,
        initOps,
        isOptionNotMerge = true,
        getChartInstance,
        echarts,
        style,
    } = props;
    const myChartRef = useRef<ECharts>();
    const chartContainer = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!myChartRef.current && chartContainer.current) {
            myChartRef.current = echarts.init(chartContainer.current, initOps);
            if (getChartInstance) {
                getChartInstance(myChartRef.current as ECharts);
            }
        }

        if (chartOptions && myChartRef.current) {
            myChartRef.current.setOption(
                {
                    ...chartOptions,
                    animationDelayUpdate: 100,
                },
                {
                    notMerge: isOptionNotMerge,
                    lazyUpdate: true,
                }
            );
        }
    }, [chartOptions]);

    return (
        <div className={"chart-base"} ref={chartContainer} style={style}></div>
    );
};

export default ChartBase;
