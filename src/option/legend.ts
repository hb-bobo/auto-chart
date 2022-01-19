export interface LegendOption {
    id: string;
    show: boolean;
    zlevel: number;
    z: number;
    left: string;
    top: number | string;
    right: number | string;
    bottom: number | string;
    width: number | string;
    height: number | string;
    orient: "horizontal" | "vertical";
}
const defaultOption: Partial<LegendOption> = {
    right: 0,
    // left: 'auto',
    top: 0,
};
export function getLegend(option: Partial<LegendOption>) {
    return Object.assign({}, defaultOption, option);
}
