const { mode } = require("webpack-nano/argv");
const { merge } = require("webpack-merge");
const parts = require("./webpack.parts");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const path = require('path');

// 如果我们不想通过 JS 处理 css，也可以在打包入口处这样去配置，需要注意的是 css 样式的顺序。
// const glob = require("glob");

// const commonConfig = merge([
//   {
//     entry: { style: glob.sync("./src/**/*.css") },
//   }
// ])

const cssLoaders = [parts.autoprefix(), parts.tailind()];
const defaultPlugins = {
  plugins: [
    new CleanWebpackPlugin(),
  ]
}

const commonConfig = merge([
  {
    entry: ["./src"],
    output: {
      path: path.resolve(process.cwd(), 'dist'), // 配置这里，不需要再配置 clean-webpack-plugin 的 options.output.path;
      publicPath: "", // 需要设置这个，MiniCssExtractPlugin 处理图片的时候才不会报错。
    },
    optimization: {
      moduleIds: 'named',
    }
  },
  parts.page({ title: "Demo" }),
  parts.extractCSS({ loaders: cssLoaders }),
  // parts.loadCSS(),
  parts.loadSASS(),
  parts.loadImages(15000),
  parts.loadJavaScript(),
]);

const productionConfig = merge([parts.eliminateUnusedCSS(), parts.generateSourceMaps({ type: 'cheap-source-map' }), defaultPlugins]);

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
