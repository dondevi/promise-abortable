/**
 * Rollup config
 *
 * @author dondevi
 * @create 2019-06-23
 */

import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";
import { uglify } from "rollup-plugin-uglify";

// "amd", "cjs", "system", "esm", "iife", "umd"

const config = [{
  input: "src/index.js",
  output: {
    name: "AbortablePromise",
    file: `dist/index.js`,
    format: "iife"
  },
  plugins: [
    resolve(),
    commonjs(),
    babel({
      exclude: ["node_modules/**"]
    })
  ]
}, {
  input: "src/index.js",
  output: {
    name: "AbortablePromise",
    file: `dist/index.min.js`,
    format: "iife"
  },
  plugins: [
    resolve(),
    commonjs(),
    babel({
      exclude: ["node_modules/**"]
    }),
    uglify()
  ]
}];

export default config;
