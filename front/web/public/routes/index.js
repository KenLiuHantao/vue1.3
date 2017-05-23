/**
 * Created by SkyeTang on 2016/12/5.
 */
let cfgGroup = [
		'serviceRouter.js'
	];

/* 路由配置文件 */

function initData(router) {
	let initObj = {},
		obj = {}

	for (let i = 0; i < cfgGroup.length; i++) {
		obj = require('./config/' + cfgGroup[i]);
		initObj = Object.assign(obj,initObj)
	}
	initObj['*'] = {
		name: '404',
		component(resolve){
			require(['../src/404/app'], resolve)
		},
		title: '404'
	}
	return initObj
}

export default initData()
