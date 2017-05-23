<script>
export default {
    props: ['data', 'edit'],
    ready() {
        // this.addInit()
    },
    data() {
        return {
            tableCfg: {
                width: [3, 3, 3, 3, 3, 3], //排除序号，多选，单选，操作栏
                head: ['供应商', '币种', '税率（%）', '含税单价', '订货单', '生效 / 失效日'],
            },
            currentIndex: 0,
            initItem: {
                "beginDate": "",
                "currencyCode": "",
                "currencyName": "",
                "currencySymbol": "",
                "endDate": "",
                "isDefault": 0,
                "orderMaxQty": 0,
                "orderMinQty": 0,
                "recordVersion": 0,
                "supplierCode": "",
                "supplierName": "",
                "supplierPriceId": "",
                "taxRate": 0,
                "taxUnitPrice": 0
            },
            cusMod: {
                show: false,
                data: ''
            },
            dateCfg: {
                format: 'YYYY-MM-DD'
            }
        }
    },
    methods: {
        copyParam(base, target) {
            let tk = Object.keys(target)

            for (let i in base) {
                if (tk.indexOf(i) != -1) {
                    target[i] = base[i]
                }
            }
        },
        /* table操作 */
        addInit() {
            let obj = {}
            obj = Object.assign({}, this.initItem)
            this.data.push(obj)
        },
        delItem(ind) {
            this.data.splice(ind, 1)
        },
        openCus(ind) {
            this.currentIndex = ind
            this.cusMod.show = true
        },
        getCus(item) {
            this.cusMod.show = false
            this.data[this.currentIndex].supplierName = item.supplierName
            this.data[this.currentIndex].supplierCode = item.supplierCode
        },
        setDefault(ind) {
            this.data.forEach((item) => {
                item.isDefault = 0
            })
            this.data[ind].isDefault = 1
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
                    <th width="10%"></th>
                    <th width="46px"></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for='item in data'>
                    <td>
                        <p>{{item.supplierName}}</p>
                    </td>
                    <td>
                        <p>{{item.currencyName}}</p>
                    </td>
                    <td>
                        <p>{{item.taxRate}}</p>
                    </td>
                    <td>
                        <p>{{item.taxUnitPrice}}</p>
                    </td>
                    <td>
                        <div class="show-wrap">
                        <p>{{item.orderMinQty}}</p>
                        <p>{{item.orderMaxQty}}</p>
                        </div>
                    </td>
                    <td>
                        <div class="show-wrap">
                        <p>{{item.beginDate}}</p>
                        <p>{{item.endDate}}</p>
                        </div>
                    </td>
                    <td>
                        <input :disabled='!edit' @click='setDefault($index)' type="radio" :checked='item.isDefault' :value='item.supplierPriceId'>
                    </td>
                    <td>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <refer-supplier :config.sync='cusMod' @cb='getCus'></refer-supplier>
</template>
<style lang='less' scoped>
@import 'table.less';
.cnt {
    position: relative;
    margin-top: 14px;
    min-height: 250px;
}
</style>
