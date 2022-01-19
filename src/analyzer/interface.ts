export type DataType = "integer" | "float" | "string" | "date" | "null";
export interface FieldInfo {
    type: DataType | "mixed";
    len: number;
    /** null  undefined or empty string */
    missing: number;
    /**
     * 长度
     * 取String(value).length
     */
    maxLength: number;
}
export interface NumberFieldInfo extends FieldInfo {
    min: number;
    max: number;

    /**
     * 平均数
     */
    avg: number;
    /**
     * 中位数
     */
    median: number;
    sum: number;
    /**
     * 单位 比如 %， 万，元
     */
    unit: string;
}

export interface StringFieldInfo extends FieldInfo {
    /**
     * 最长的字符串
     */
    maxStr: string;
}

export interface DateFieldInfo extends FieldInfo {}

export type MergeTypes = FieldInfo &
    Partial<NumberFieldInfo & StringFieldInfo & DateFieldInfo>;
