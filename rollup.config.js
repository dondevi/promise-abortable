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
  input: "src/index.js",
  output: {
    name: "AbortablePromise",
    file: `dist/cjs.es6.js`,
    format: "cjs"
  },
  plugins: [
    uglifyEs()
  ]
}, {
  input: "src/index.js",
  output: {
    name: "AbortablePromise",
    file: `dist/esm.es6.js`,
    format: "esm"
  },
  plugins: [
    uglifyEs()
  ]
}, {
  input: "src/index.es5.js",
  output: {
    name: "AbortablePromise",
    file: `dist/cjs.es5.js`,
    format: "cjs"
  },
  plugins: [
    uglifyEs()
  ]
}, {
  input: "src/index.js",
  output: {
    name: "AbortablePromise",
    file: `dist/iife.es6.js`,
    format: "iife"
  },
  plugins: [
    uglifyEs()
  ]
}, {
  input: "src/index.es5.js",
  output: {
    name: "AbortablePromise",
    file: `dist/iife.es5.js`,
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
  input: "src/index.es5.js",
  output: {
    name: "AbortablePromise",
    file: `dist/iife.es3.js`,
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
