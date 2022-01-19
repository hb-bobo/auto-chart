import React from "react";
import "./icon.css";
import "../icon/iconfont.js";
interface Props {
    className?: string;
    type: string;
}

const ChartIcon: React.FC<Props> = (props) => {
    const { type, className } = props;
    return (
        <svg className={`icon ${className}`} aria-hidden="true">
            <use xlinkHref={`#icon-${type.replace(/_/g, "-")}-chart`} />
        </svg>
    );
};
export default ChartIcon;
