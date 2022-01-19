/* eslint-disable @typescript-eslint/no-var-requires */
const { src, dest, series } = require("gulp");
const typescript = require("gulp-typescript");
const alias = require("gulp-ts-alias");
const merge = require("merge2");
const babel = require("gulp-babel");

const tsProject = typescript.createProject("tsconfig.json");

function build(next) {
    const tsResult = src([
        "./src/**/*.ts",
        "./src/**/*.tsx",
        "!./test/**/*.ts",
        "!./src/**/*.stories.tsx",
    ])
        .pipe(alias({ configuration: tsProject.config }))
        .pipe(tsProject());
    const jsxResult = src(["./src/react/**/*.tsx", "!./src/**/*.stories.tsx"])
        .pipe(babel({ babelrc: true }))
        .pipe(dest("lib/react"));
    const reactCssResult = src(["./src/react/**/*.css"]).pipe(
        dest("lib/react")
    );
    const icon = src("src/icon/*").pipe(dest("lib/icon"));
    return merge([
        jsxResult,
        tsResult.js.pipe(dest("lib")),
        tsResult.dts.pipe(dest("lib")),
        icon,
        reactCssResult,
    ]);
}
exports.default = series(build);
