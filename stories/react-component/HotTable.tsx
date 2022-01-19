import React from "react";
import { HotTable, HotTableProps } from "@handsontable/react";
import "handsontable/dist/handsontable.full.css";

interface Props extends HotTableProps {
    // onChange
    afterPaste?: HotTableProps["afterPaste"];
    afterChange?: HotTableProps["afterChange"];
}

const Table: React.FC<Props> = (props) => {
    const { data, width, height, afterPaste, afterChange } = props;

    return (
        <div className="hot-table">
            <HotTable
                data={data}
                colHeaders={true}
                rowHeaders={true}
                width={width}
                height={height}
                contextMenu
                licenseKey="non-commercial-and-evaluation"
                afterPaste={afterPaste}
                afterChange={afterChange}
            />
        </div>
    );
};

export default Table;
