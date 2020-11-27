const { WebpackPluginServe } = require('webpack-plugin-serve');
const { MiniHtmlWebpackPlugin } = require('mini-html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const glob = require('glob');
const PurgeCSSPlugin = require('purgecss-webpack-plugin');

const ALL_FILES = glob.sync(path.join(__dirname, 'src/*.js'));
const APP_SOURCE = path.join(__dirname, 'src');

exports.devServer = () => ({
  watch: true,
  plugins: [
    new WebpackPluginServe({
      port: process.env.PORT || 8080,
      static: './dist',
      liveReload: true,
      waitForBuild: true,
    })
  ]
});

exports.page = ({ title }) => ({
  plugins: [
    new MiniHtmlWebpackPlugin({ context: { title }})
  ]
});

exports.loadCSS = () => ({
  module: {
    rules: [
      { test: /\.css$/, resourceQuery: /inline/, use: ['style-loader', 'css-loader'] },
    ]
  }
})

exports.loadSASS = () => ({
  module: {
    rules: [
      { test: /\.s[ac]ss$/i, use: ['style-loader', 'css-loader', 'sass-loader'] }
    ]
  }
})

exports.extractCSS = ({ options = { }, loaders = [] } = {}) => {
  return {
    module: {
      rules: [
        {
          test: /\.css$/,
          // 这里会自上而下地匹配文件，如果 /inline/ 这行放到最后，会导致先匹配到 MiniCssExtract 的 loader 从而对于 ?inline 的文件不会单独生成 style 标签。
          // btw: 来自不同文件的样式，即便选择器相同，也不会进行合并。 
          oneOf: [
            { resourceQuery: /inline/, use: ['style-loader', 'css-loader'] },
            {
              use: [
                { loader: MiniCssExtractPlugin.loader, options },
                'css-loader',
              ].concat(loaders),
            },
          ],
          sideEffects: true, // sideEffects: true is needed if you distribute your code as a package and want to use Tree Shaking against it.
        }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].css', // or emit to specific directory: style/[name].css
      })
    ]
  }
}

exports.tailind = () => ({
  loader: 'postcss-loader',
  options: {
    postcssOptions: {
      plugins: [require('tailwindcss')],
    }
  }
})

exports.eliminateUnusedCSS = () => ({
  plugins: [
    new PurgeCSSPlugin({
      paths: ALL_FILES,
      extractors: [
        {
          extractor: (content) => content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [],
          extensions: ['html'],
        }
      ]
    })
  ]
})

exports.autoprefix = () => ({
  loader: 'postcss-loader',
  options: {
    postcssOptions: {
      plugins: [require('autoprefixer')()],
    }
  }
})

exports.loadImages = ({ limit }) => ({
  module: {
    rules: [
      {
        test: /\.(png|jpg)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: limit,
          }
        }
      }
    ]
  }
})

exports.loadJavaScript = () => ({
  module: {
    rules: [
      { test: /\.js$/, use: 'babel-loader', include: APP_SOURCE },
    ]
  }
})