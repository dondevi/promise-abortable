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
import uglifyEs from "rollup-plugin-uglify-es";

// "amd", "cjs", "system", "esm", "iife", "umd"

const config = [{
  input: "src/index.es5.js",
  output: {
    name: "AbortablePromise",
    file: `dist/es5.min.js`,
    format: "iife"
  },
  plugins: [
    resolve(),
    commonjs(),
    babel({
      babelrc: false,
      presets: [["@babel/env", { "targets": { "ie": "10" } }]]
    }),
    uglify()
  ]
}, {
  input: "src/index.js",
  output: {
    name: "AbortablePromise",
    file: `dist/polyfill.min.js`,
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
}, {
  input: "src/index.js",
  output: {
    name: "AbortablePromise",
    file: `dist/es6.min.js`,
    format: "iife"
  },
  plugins: [
    resolve(),
    commonjs(),
    babel({
      babelrc: false,
      presets: [["@babel/env", { "targets": { "chrome": "75" } }]]
    }),
    uglifyEs()
  ]
}];

export default config;
