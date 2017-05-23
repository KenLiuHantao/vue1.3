/**
 * Created by SkyeTang on 2016/12/5.
 */

/* 路由配置文件 */
import cfg from './cfg.js'

export default function(router) {
    let arr = cfg,
        initObj = {}

    for (let i = 0; i < arr.length; i++) {
        initObj['/:systemType/' +arr[i].key] = {
            name: arr[i].key,
            component: (resolve) => {
                require(['../src/' + arr[i].key ], resolve)
            },
            title: arr[i].title
        }
    }

    router.map(initObj)
}
