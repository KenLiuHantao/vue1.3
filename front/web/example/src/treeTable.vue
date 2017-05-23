<script>
import bom from 'nb/treeTable/app'

export default {
    components: {
        bom
    },
    ready() {
        // this.getData()
    },
    data() {
        return {
            modalCfg: {
                show: false,
                title: '新增'
            },
            treeTableCfg: {
                data: {}, //为对象
                /* type类型有三种
                 * 0 - 新增
                 * 1 - 查看
                 * 2 - 编辑
                 */
                type: 0 //是否为编辑状态
            },
            tType: 0,
            tData: {
                "attributeCode": "1",
                "attributeName": "",
                "children": [{
                    "attributeCode": "",
                    "attributeName": "",
                    "byUnitCode": "",
                    "byUnitName": "",
                    "childBom": {},
                    "conversionRate": 0,
                    "demandDate": "",
                    "docNo": "",
                    "docVersion": 0,
                    "inventoryCategoryCode": "",
                    "inventoryCategoryName": "",
                    "inventoryCode": "",
                    "inventoryId": "",
                    "inventoryName": "",
                    "inventorySpec": "",
                    "last": false,
                    "lossRate": 0,
                    "manuPlanQuantity": 0,
                    "manuQuantity": 0,
                    "packQty": 0,
                    "quantity": 0,
                    "recordId": "",
                    "recordStatus": 0,
                    "recordVersion": 0,
                    "remark": "",
                    "supplierAmount": 0,
                    "supplierCode": "",
                    "supplierName": "",
                    "supplierPrice": 0,
                    "unitCode": "",
                    "unitName": ""
                }],
                "docNo": "",
                "docVersion": 0,
                "docVersionRemark": "",
                "docVersionTime": "",
                "files": [],
                "inventoryCategoryCode": "",
                "inventoryCategoryName": "",
                "inventoryCode": "",
                "inventoryId": "",
                "inventoryName": "",
                "inventorySpec": "",
                "processVo": {
                    "departmentCode": "",
                    "departmentEmployeeCode": "",
                    "departmentEmployeeName": "",
                    "departmentName": "",
                    "docNo": "",
                    "docVersion": 0,
                    "manuQuantity": 12,
                    "processCode": "",
                    "processName": "",
                    "recordId": "",
                    "recordVersion": 0,
                    "workAmount": 0,
                    "workPrice": 0
                },
                "recordId": "",
                "recordStatus": 0,
                "recordVersion": 0,
                "remark": "",
                "supplierCode": "",
                "supplierName": ""
            }
        }
    },
    methods: {
        getData() {
            let param = {
                docNo: "BOM201702160001",
                docVersion: 10
            }
            this.$http.post(__URL.dev + 'product/material/get', param).then(
                (res) => {
                    this.tData = res.data.data
                }
            )
        },
        saveData() {
            this.$http.post(__URL.dev + 'order/material/update', this.tData).then(
                (res) => {
                    if (res.data.success) {
                        alert(res.data.success)
                    } else {
                        alert(res.data.errMsg)
                    }
                }
            )
        }
    }
}
</script>
<template>
    <!-- <pre class="fix">{{tData | json}}</pre> -->
    <button class="btn-lg-imp" @click='getData'>获取数据</button>
    <button class="btn-lg-imp" @click='saveData'>保存数据</button>
    <pre>
        data: {}, //为对象

        /* type类型有三种
         * 0 - 新增
         * 1 - 查看
         * 2 - 编辑
         */

        type: 0 //是否为编辑状态
    </pre>
    <div class="tBox">
        <bom :data.sync='tData' :type='tType'></bom>
    </div>
</template>
<style lang='less' scoped>
.fix {
    position: absolute;
    top: 50px;
    right: 0;
    height: 300px;
    overflow: scroll;
    width: 40%;
    background-color: rgba(0, 0, 0, 0.2);
    color: #844242;
    z-index: 9999
}

pre {
    margin: 10px;
    padding: 10px;
    border-left: 2px solid cadetblue;
    overflow: auto;
}

.tBox {
    width: 100%;
    height: 400px;
    overflow-y: auto;
}
</style>
