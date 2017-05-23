<script>
export default {
    props: ['data', 'edit'],
    ready() {
        this.addInit()
    },
    data() {
        return {
            tableCfg: {
                width: [4, 3, 3, 3, 3, 4], //排除序号，多选，单选，操作栏
                head: ['开发工程师', '损耗率(%)', '工序', '生产班组', '班组负责人', '最小包装数'],
            },
            currentIndex: 0,
            initItem: {
                "departmentCode": "",
                "departmentEmployeeCode": "",
                "departmentEmployeeName": "",
                "departmentName": "",
                "employeeCode": "",
                "employeeName": "",
                "lossRate": 0,
                "minPackQty": "",
                "processCode": "",
                "processName": ""
            },
            empMod: {
                show: false
            },
            proMod: {
                show: false
            }
        }
    },
    methods: {
        /* table操作 */
        addInit() {
            // let obj = {}
            // obj = Object.assign({}, this.initItem)
            this.data = Object.assign({}, this.initItem)
        },
        delItem(ind) {
            this.data.splice(ind, 1)
        },
        copyParam(base, target) {
            let tk = Object.keys(target)

            for (let i in base) {
                if (tk.indexOf(i) != -1) {
                    target[i] = base[i]
                }
            }
        },
        openEmp(ind) {
            // this.currentIndex = ind
            this.empMod.show = true
        },
        getEmp(item) {
            this.empMod.show = false
            this.data.employeeCode=item.employeeCode;
            this.data.employeeName=item.employeeName;
            // this.copyParam(item, this.data)
        },
        openPro(ind) {
            // this.currentIndex = ind
            this.proMod.show = true
        },
        getProcess(item) {
            this.proMod.show = false
            this.copyParam(item, this.data)
        }
    },
    computed: {
        thead() {
            return this.tableCfg.head
        },
        wdt() {
            return this.tableCfg.width
        }
    }
}
</script>
<template>
    <div class="cnt">
        <table class="inner-table">
            <thead>
                <tr>
                    <th v-for='th in thead' track-by="$index" :width="wdt[$index]*5+'%'">{{th}}</th>
                    <th v-if='edit' width="46px">操作</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <div v-if='edit' class="s-input">
                            <input type="text" placeholder="开发工程师" readonly v-model='data.employeeName'>
                            <i class="icon-search r1" @click='openEmp($index)'></i>
                        </div>
                        <p v-else>{{data.employeeName}}</p>
                    </td>
                    <td>
                        <input v-if='edit' type="text" placeholder="损耗率" v-model='data.lossRate'>
                        <p v-else>{{data.lossRate}}</p>
                    </td>
                    <td>
                        <div v-if='edit' class="s-input">
                            <input type="text" placeholder="工序" v-model='data.processName' readonly>
                            <i class="icon-search r1" @click='openPro($index)'></i>
                        </div>
                        <p v-else>{{data.processName}}</p>
                    </td>
                    <td>
                        <p>{{data.departmentName}}</p>
                    </td>
                    <td>
                        <p>{{data.departmentEmployeeName}}</p>
                    </td>
                    <td>
                        <input-number placeholder="请输入最小包装数" v-if='edit'  :code.sync='data.minPackQty'></input-number>
                        <p v-else>{{data.minPackQty}}</p>
                    </td>
                    <td v-if='edit'>
                        <button class="button-danger" @click='delItem($index)'>删除</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <refer-employee :config.sync='empMod' @cb='getEmp'></refer-employee>
    <refer-process :config.sync='proMod' @cb='getProcess'></refer-process>
</template>
<style lang='less' scoped>
@import 'table.less';
.cnt {
    position: relative;
    margin-top: 14px;
    min-height: 250px;
}
</style>
