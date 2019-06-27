/**
 * Rollup config
 *
 * @author dondevi
 * @create 2019-06-23
 */

import babel from "rollup-plugin-babel";
// import eslint from "rollup-plugin-eslint";

const formats = ["amd", "cjs", "es", "iife", "umd"];

const config = formats.map(format => {
  return {
    input: "src/index.js",
    output: {
      name: "AbortablePromise",
      file: `dist/index.${format}.js`,
      format
    },
    plugins: [
      babel({
        exclude: ["node_modules/**"]
      }),
      // eslint({
      //   throwOnError: true,
      //   throwOnWarning: true,
      //   include: ['src/**'],
      //   exclude: ['node_modules/**']
      // })
    ]
  }
});

export default config;
