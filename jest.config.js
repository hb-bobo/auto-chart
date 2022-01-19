/* eslint-disable @typescript-eslint/no-var-requires */
const { defaults } = require("jest-config");
const tsConfig = require("./tsconfig.json");

tsConfig.compilerOptions.types = ["jest"];
module.exports = {
    globals: {
        "ts-jest": {
            tsConfig: tsConfig.compilerOptions
        }
    },
    moduleFileExtensions: [...defaults.moduleFileExtensions, "ts"],
    moduleNameMapper: {
        "^ROOT/(.*)$": "<rootDir>/src/$1"
    },
    transform: {
        "^.+\\.ts?$": "ts-jest"
    },
    testRegex: "^.+\\.test\\.(ts)$",
    testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"], // 转换时需忽略的文件
    testURL: "http://localhost/" // 运行环境下的URl
};
