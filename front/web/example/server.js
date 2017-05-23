var express = require('express')
var webpack = require('webpack')
var proxy = require('http-proxy-middleware')
var proCfg = require('../../proxy/proxy.js')
var api = require('../../config/api')


//引入热加载中间件
var WebpackDevMiddleware = require('webpack-dev-middleware')
var WebpackHotMiddleware = require('webpack-hot-middleware')
var config = require('./webpack.dev')
var compile = webpack(config)

var app = express();
//设置端口号
app.set('port', process.env.PORT || 3001);

//使用热加载
app.use(WebpackDevMiddleware(compile, {
    noInfo: true,
    publicPath: config.output.publicPath,
    status: { color: true }
}))
app.use(WebpackHotMiddleware(compile))

//设置静态资源根路径

app.use(express.static(__dirname + '/resources'))


Object.keys(api).forEach(function(item){
    app.use('/'+api[item].split('/')[0], proxy(proCfg.ierp))
})

app.listen(app.get('port'), function() {
    console.log('app listing on ' + app.get('port') +" http://localhost:"+app.get('port'))
})
