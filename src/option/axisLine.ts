const defaultOption: any = {
    lineStyle: {
        color: "#CCCCCC",
    },
};
export function getAxisLine(option: any) {
    return Object.assign({}, defaultOption, option);
}
