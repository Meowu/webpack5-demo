const { mode } = require("webpack-nano/argv");
const { merge } = require("webpack-merge");
const parts = require("./webpack.parts");
const path = require("path");

// 如果我们不想通过 JS 处理 css，也可以在打包入口处这样去配置，需要注意的是 css 样式的顺序。
// const glob = require("glob");

// const commonConfig = merge([
//   {
//     entry: { style: glob.sync("./src/**/*.css") },
//   }
// ])

const cssLoaders = [parts.autoprefix(), parts.tailind()];

const commonConfig = merge([
  {
    entry: ["./src"],
    /**
     * 像下面这样定义可以得到跟定义 optimization.splitChunks 同样的效果。
     */
    // entry: {
    //   // app: './src',
    //   // 定义多入口
    //   app: {
    //     import: './src',
    //     dependOn: 'vendors', // 依赖的包，那么 vendors 必须作为一个打包入口，app.js 不会再把 vendors 打包进来。
    //   },
    //   vendors: ['react', 'react-dom'], // 独立的包，可以被其它包所依赖。
    // },
    output: {
      path: path.resolve(process.cwd(), "dist"), // 配置这里，不需要再配置 clean-webpack-plugin 的 options.output.path;
      publicPath: "", // 需要设置这个，MiniCssExtractPlugin 处理图片的时候才不会报错。
    },
    optimization: {
      moduleIds: "named",
    },
  },
  parts.clean(),
  parts.page({ title: "Demo" }),
  parts.extractCSS({ loaders: cssLoaders }),
  // parts.loadCSS(),
  parts.loadSASS(),
  parts.loadImages(15000),
  parts.loadJavaScript(),
]);

const productionConfig = merge([
  parts.eliminateUnusedCSS(),
  parts.generateSourceMaps({ type: "cheap-source-map" }),
  {
    optimization: {
      splitChunks: {
        chunks: 'all', // 发现每次 react 相关都公共包都输出 471.js ，471 是基于什么来生成的。
      }
    }
  },
  parts.attachRevision(),
]);

const developmentConfig = merge([
  { entry: ["webpack-plugin-serve/client"] },
  parts.devServer(),
]);

const getConfig = (mode) => {
  switch (mode) {
    case "production":
      return merge(commonConfig, productionConfig, { mode });
    case "development":
      return merge(commonConfig, developmentConfig, { mode });
    default:
      return merge(commonConfig, productionConfig, { mode });
    // throw new Error(`Trying to use an unknown mode: ${mode}.`);
  }
};

module.exports = getConfig(mode);
