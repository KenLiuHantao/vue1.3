var webpack = require('webpack')
var path = require('path')
var htmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require("extract-text-webpack-plugin")
var CopyWebpackPlugin = require('copy-webpack-plugin')

//根据当前所在项目，设置入口文件
var entry = {
    "vue":['vue','vue-resource']
}
var proName = path.basename(__dirname);
entry[proName] = path.join(__dirname)

//根据当前入口文件，设置生成html里所需要引入的chunk
var c = ['vue'];
c.push(proName)

var config = {
    //设置能解析的默认后缀名
    resolve: {
        extensions: ['', '.js', '.vue', '.json', '.css'],
        alias: {
            'nc':path.resolve(__dirname,"../../components/basic"),
            'nb':path.resolve(__dirname,"../../components/business"),
            'np':path.resolve(__dirname,"../../public"),
            'admin': path.resolve(__dirname, "./src/admin"),
            'archive': path.resolve(__dirname, "./src/archive"),
            'develop': path.resolve(__dirname, "./src/development"),
            'financial': path.resolve(__dirname, "./src/financial"),
            'manufacture': path.resolve(__dirname, "./src/manufacture"),
            'purchase': path.resolve(__dirname, "./src/purchase"),
            'sale': path.resolve(__dirname, "./src/sale"),
            'warehouse': path.resolve(__dirname, "./src/warehouse")
        }
    },

    //设置入口文件
    entry: entry,

    //设置输出文件
    output: {
        path: path.join(__dirname, 'dist/META-INF/resources'),
        filename: 'webjars/[name]_[hash:7].js',
        chunkFilename:'webjars/chunks/[id]_[chunkhash:7].js',
        publicPath: ''
    },

    //模块加载器
    module: {
        loaders: [
            { test: /\.vue$/, loader: 'vue' },
            { test: /\.js$/, loader: 'babel', exclude: /node_modules/ },
            { test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader")},
            { test: /\.(less)$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader!less-loader') },
            { test: /\.(png|gif|jpg|jpeg)$/, loader: 'url?limit=11111&name=webjars/images/[name]_[hash:7].[ext]'},
            { test: /\.(svg|ttf|eot|woff|woff2)/, loader: 'url?limit=11111&name=webjars/fonts/[name].[ext]' },
        ]
    },

    //vue模块解析器
    vue: {
        loaders: {
            less: ExtractTextPlugin.extract('vue-style-loader', 'css-loader!less-loader',{publicPath:'../'})
        }
    },

    //其它插件
    plugins: [
        //删除警告
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        //压缩js
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        //剥离公共JS
        new webpack.optimize.CommonsChunkPlugin(/* chunkName= */"vue", /* filename= */"webjars/common_[hash:7].js"),


        //提取样式为单独的文件
        new ExtractTextPlugin('webjars/[name]_[hash:7].css'),

        //自动生成html文件的配置,并设置chunk为前面设置的c
        new htmlWebpackPlugin({
            filename: 'index.html',
            template: path.join(__dirname, '/index.html'),
            inject: true,
            chunks: c,
            path:'webjars/'
        }),

        //复制静态资源到指定目录
        new CopyWebpackPlugin([
            {
                from:path.resolve(__dirname,'../../public/plugin/'),
                to:'webjars',
                ignore: ['.*']
            }
        ])
    ]

}

module.exports = config
