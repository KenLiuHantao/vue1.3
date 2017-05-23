/**
 * Created by SkyeTang on 2016/12/5.
 */
let cfgGroup = [
		'adminRouter.js',
		'archiveRouter.js',
		'developmentRouter.js',
		'financialRouter.js',
		'manufactureRouter.js',
		'purchaseRouter.js',
		'saleRouter.js',
		'warehouseRouter.js',
		'oaRouter.js',
		'serviceRouter.js',
		'crm.js',
		'hrRouter.js',
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
    initObj['/'] = {
        key: '欢迎进入我的经管',
        component (resolve){
            require(['../src/default/app'], resolve)
        },
        title: '主页'
    }
	initObj['*'] = {
		key: '404',
		component(resolve){
			require(['../src/404/app'], resolve)
		},
		title: '404'
	}
	return initObj
}

export default initData()
