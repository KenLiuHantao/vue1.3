var webpack = require('webpack')
var path = require('path')
var htmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require("extract-text-webpack-plugin")
var packageConfig = require('../../package.json')
var hotMiddlewareScript = 'webpack-hot-middleware/client?reload=true'
//根据当前所在项目，设置入口文件
var entry = {
    "vue": ['vue', 'vue-resource','vue-router']
}
var proName = path.basename(__dirname);
entry[proName] = [hotMiddlewareScript, path.join(__dirname)]

//根据当前入口文件，设置生成html里所需要引入的chunk
var c = ['vue'];
c.push(proName)

var config = {
    //设置能解析的默认后缀名
    resolve: {
        extensions: ['', '.js', '.vue', '.json', '.css'],
        alias: {
            'nc': path.resolve(__dirname, "../../components/basic"),
            'nb': path.resolve(__dirname, "../../components/business"),
            'np': path.resolve(__dirname, "../../public"),
        }
    },
    devtool: "source-map",

    //设置入口文件
    entry: entry,

    //设置输出文件
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'webjars/js/[name].'+ packageConfig.version +'.js',
        chunkFilename: 'webjars/chunks/[id]_'+ packageConfig.version +'.js',
        publicPath: '/'
    },

    //模块加载器
    module: {
        loaders: [
            { test: /\.vue$/, loader: 'vue' },
            { test: /\.js$/, loader: 'babel', exclude: /node_modules/ },
            { test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader") },
            { test: /\.less$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader!less-loader') },
            { test: /\.(png|gif|jpg)$/, loader: 'url?limit=11111&name=webjars/images/[name].'+ packageConfig.version +'.[ext]' },
            { test: /\.(svg|ttf|eot|woff|woff2)/, loader: 'url?limit=11111&name=webjars/fonts/[name].'+ packageConfig.version +'.[ext]' },
        ]
    },

    //vue模块解析器
    vue: {
        loaders: {
            less: ExtractTextPlugin.extract('vue-style-loader', 'css-loader!less-loader')
        }
    },

    //其它插件
    plugins: [
        //热加载
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),

        //剥离公共JS
        new webpack.optimize.CommonsChunkPlugin( /* chunkName= */ "vue", /* filename= */ "webjars/common."+ packageConfig.version +".js"),

        //提取样式为单独的文件
        new ExtractTextPlugin('webjars/css/[name].'+ packageConfig.version +'.css'),

        //自动生成html文件的配置,并设置chunk为前面设置的c
        new htmlWebpackPlugin({
            filename: 'index.html',
            template: path.join(__dirname, '/index.html'),
            inject: true,
            chunks: c
        }),
    ]

}

module.exports = config
