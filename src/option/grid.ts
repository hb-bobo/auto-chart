export interface GridOption {
    id: string;
    show: boolean;
    zlevel: number;
    z: number;
    left: number | string;
    top: number | string;
    right: number | string;
    bottom: number | string;
    width: number | string;
    height: number | string;
    containLabel: boolean;
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
    shadowBlur: string;
    shadowColor: string;
    shadowOffsetX: number;
    shadowOffsetY: number;
}
const defaultOption: Partial<GridOption> = {
    left: 0,
    // width: 900,
    // height: 500,
};
export function getGrid(option: Partial<GridOption>) {
    return Object.assign({}, defaultOption, option);
}
