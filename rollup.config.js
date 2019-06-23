/**
 * Rollup config
 *
 * @author dondevi
 * @create 2019-06-23
 */

import babel from "rollup-plugin-babel";
// import eslint from "rollup-plugin-eslint";

const config = {
  input: "src/index.js",
  output: {
    name: "AbortablePromise",
    file: "dist/index.js",
    format: "cjs"
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
};

export default config;
