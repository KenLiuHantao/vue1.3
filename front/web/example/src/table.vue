<script>
import vtable from 'nc/table/app'
import im from '../img/404.png'

export default {
    components: {
        vtable
    },
    data() {
        return {
            tableCfg: {
                edit: true, //编辑状态
                serial: true,
                operating: [true, 'base-operate', {}],
                review: [true, 'review', [{
                    val: 0,
                    icon: 'icon-success',
                    style: [{
                        color: 'red'
                    }],
                    img: im
                }]],
                width: [3, 3, 3, 3, 3, 3], //排除序号，多选，单选，操作栏
                match: [{
                        key: 'inventoryCode',
                        href: true
                    },
                    (obj) => {
                        return '自定义假设:' + obj.inventoryName + '<br/>' + obj.inventorySpec
                    }, {
                        key: 'inventorySpec',
                        input: true,
                        width: '150px',
                        inputGroup: true,
                        sub: [{
                            key: 'review',
                            input: true,
                            width: '150px',
                            inputGroup: true,
                        }]
                    },
                    'unitName',
                    'attributeName',
                    'enableDate'
                ],
                head: ['货品编码', () => {
                    return '测试换行<br/>货品名称'
                }, '规格型号', '单位', '货品属性', '启用日期'],
            },
            /* -模拟数据- */
            tableData: [{
                "inventoryId": "7496fc05-0f55-4542-96fc-050f553542df",
                "inventoryCode": "test1",
                "inventoryName": "这是测试1",
                "inventorySpec": "TGP-001",
                "unitName": "箱",
                "attributeName": "生产件",
                "enableDate": "2017-02-06",
                "review": 0
            }, {
                "inventoryId": "a502db25-4959-4a5c-82db-2549591a5cce",
                "inventoryCode": "sdafadsfa",
                "inventoryName": "asdfadsf",
                "inventorySpec": "adfadsf",
                "unitName": "箱",
                "attributeName": "虚拟件",
                "enableDate": "2017-02-06",
                "review": 1
            }, {
                "inventoryId": "a8a89dce-078c-4246-a89d-ce078c5246df",
                "inventoryCode": "测试1",
                "inventoryName": "测试1",
                "inventorySpec": "测试1",
                "unitName": "件",
                "attributeName": "虚拟件",
                "enableDate": "2017-02-07",
                "review": 1
            }, {
                "inventoryId": "1068c166-86c6-4856-a8c1-6686c60856b8",
                "inventoryCode": "测试测试",
                "inventoryName": "测试测试",
                "inventorySpec": "测试测试",
                "unitName": "件",
                "attributeName": "采购件",
                "enableDate": "2017-02-07",
                "review": 0
            }, {
                "inventoryId": "bbef50b6-352f-4938-af50-b6352f7938c5",
                "inventoryCode": "010003",
                "inventoryName": "手表",
                "inventorySpec": "只",
                "unitName": "件",
                "attributeName": "采购件",
                "enableDate": "2017-02-07",
                "review": 0
            }, {
                "inventoryId": "3db77515-ffa5-4b59-b775-15ffa55b593e",
                "inventoryCode": "asdfas",
                "inventoryName": "asdfasdf",
                "inventorySpec": "adsfasdf",
                "unitName": "箱",
                "attributeName": "采购件",
                "enableDate": "2017-02-07",
                "review": 0
            }]
        }
    }
}
</script>
<template>
    <pre>
/*
 * @Author:fov
 * @功能点:
 * 1.普通表格展示作用
 * 2.编辑表格展示
 * 3.编辑含复选框表格展示
 * @可操作功能块含以下几种状态
 * ——编辑状态 => input和p标签的互换
 * ——删除功能 => 单行删除整体数据
 * ——查看功能 =>
 * ——总计功能
 */

/*
 * @config:Object
 *  checkbox:true,    //多选状态，默认为false
 *  radio:true,    //单选状态，默认为false
 *  serial:true,    //是否需要序号排列，默认为false
 *  edit:true,      //是否处于编辑状态，默认为false
 *  operating:true,      //操作栏的拓展件，默认为false
 *  review:true,      //当行的变色展示，默认为false
 *  total:[true,Array(key,key)],     //是否需要合计功能，默认为false
 * @match:Array
 * 该数组为一一对应数据字段key值，根据数组字段加载数据
 * 里面可包含参数有
 * ——href => Boolean，超链接，对应方法为{}
 * ——input => Object，只能存在于编辑状态
 * ——edit => Boolean，是否为编辑按钮{}
 * ——type => Number，1-4对应为增删改查
 * ——disabled => Boolean，是否为disabled
*/
</pre>
    <div class="box">
        <div class="tableCtn">
            <vtable :config='tableCfg' :data.sync='tableData'></vtable>
        </div>
    </div>
</template>
<style lang='less' scoped>
.box {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 50%;
    overflow: auto;
}

pre {
    position: absolute;
    bottom: 0;
    right: 0;
    height: 300px;
    overflow: scroll;
    width: 40%;
    background-color: rgba(0, 0, 0, 0.2);
    color: #844242;
    z-index: 9999
}

.tableCtn {
    position: relative;
    overflow: auto;
    width: 100%;
    height: 360px;
}
</style>
