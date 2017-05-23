<script>

    export default{
        data(){
            return {
                scrapInfo: {
                    "header": {
                        "departmentCode": "",
                        "departmentName": "",
                        "employeeCode": "",
                        "employeeName": "",
                        "docDate": "",
                        "demandId": "",
                        "demandDocNo": "",
                        "sourceDocNo": "",
                        "processCode": "",
                        "processName": "",
                        "processSort": 0,
                    },
                    "dataList": []
                },

                tipsCfg: {
                    show: false,
                    content: '',
                    type: 'warning'
                },

                scrapReasons: [],

                revokeCb: true
            }
        },

        props: ['ids','cfg'],

        components: {},

        ready() {
            this.$http.post(__URL.manufacture + 'production/material/scrap/apply/detail', this.ids).then(
                (res) => {
                    this.scrapInfo = res.data.data;
                    this.getScrapReason();
                }
            )
        },

        methods: {
            applyScrap(){
                if (this.revokeCb === false)return;
                this.revokeCb = false;
                if (!this.check()) {
                    this.revokeCb = true;
                    return;
                }
                this.revokeCb = true;
                this.$http.post(__URL.manufacture + 'production/material/scrap/save', this.scrapInfo).then(
                    (res) => {
                        if (res.data.success) {
                            this.$emit('refresh', "申请报废成功!")
                        } else {
                            this.setWarningSuccess(res.data.errMsg)
                        }
                        this.revokeCb = true;
                    }
                )
            },

            check(){
                for (let i = 0; i < this.scrapInfo.dataList.length; i++) {
                    if (this.scrapInfo.dataList[i].scrapQuantity === undefined
                        || this.scrapInfo.dataList[i].scrapQuantity === null
                        || this.scrapInfo.dataList[i].scrapQuantity <= 0) {
                        this.setWarningSuccess("第" + (i + 1) + "条记录未填写申报数量！");
                        return false;
                    }
                    if (this.scrapInfo.dataList[i].scrapQuantity > this.scrapInfo.dataList[i].allowScrapQuantity) {
                        this.setWarningSuccess("第" + (i + 1) + "条记录申报数据不能大于未退数量！");
                        return false;
                    }
                    if (this.scrapInfo.dataList[i].reason === '') {
                        this.setWarningSuccess("第" + (i + 1) + "条记录未选择报废原因！");
                        return false;
                    }
                }
                return true;
            },

            getScrapReason() {
                this.$http.get(__URL.manufacture + 'production/scrap/reason').then(
                    (res) => {
                        if (res.data.success) {
                            this.scrapReasons = res.data.data.dataList;
                        }
                    },
                    (err) => {
                        console.log('初始化未能拿到报废原因数据')
                    }
                )
                console.log(this.scrapReasons)
            },

            setWarningSuccess(data) {
                this.tipsCfg.show = true;
                this.tipsCfg.content = data;
                this.tipsCfg.type = "failure";
            },

            closeOnly(){
                this.cfg.show = false;
            }
        },
    }


</script>
<template>
    <warning :config="tipsCfg"></warning>
    <div class="inner-wrapper">
        <div class="inner-content">
            <h2 class="tag">报废申请信息</h2>

            <div class="inner-item form-box">
                <div class="form-group">
                    <label>生产班组:</label>
                    <p>{{scrapInfo.header.departmentName}}</p>
                </div>
                <div class="form-group">
                    <label>申请人:</label>
                    <p>{{scrapInfo.header.employeeName}}</p>
                </div>
                <div class="form-group">
                    <label>日期:</label>
                    <p>{{scrapInfo.header.docDate}}</p>
                </div>
                <div class="form-group">
                    <label>生产订单号:</label>
                    <p>{{scrapInfo.header.demandDocNo}}</p>
                </div>
                <div class="form-group">
                    <label>关联单号:</label>
                    <p>{{scrapInfo.header.sourceDocNo}}</p>
                </div>
            </div>

            <div class="inner-item">
                <table class="inner-table mt-15">
                    <thead>
                    <tr>
                        <th width="30px">序号</th>
                        <th width="15%">货品信息</th>
                        <th width="10%">应退数量</th>
                        <th width="10%">申请报废</th>
                        <th width="10%">单位</th>
                        <th width="10%">报废原因</th>
                        <th width="10%">备注</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for='item in scrapInfo.dataList'>
                        <td>{{$index + 1}}</td>
                        <td>
                            <div class="show-wrap">
                                <p>编码:{{item.inventoryCode}}</p>
                                <p>名称:{{item.inventoryName}}</p>
                                <p>规格型号:{{item.inventorySpec}}</p>
                            </div>
                        </td>
                        <td>
                            <p>{{item.allowScrapQuantity}}</p>
                        </td>
                        <td>
                            <input-number placeholder="申报数量"
                                          :code.sync='item.scrapQuantity'></input-number>
                        </td>
                        <td>
                            <p>{{item.unitName}}</p>
                        </td>
                        <td>
                            <select v-model='item.reason'>
                                <option value="" disabled selected style="display: none;">请选择原因</option>
                                <option :value='itm.no' v-for='itm in scrapReasons'>{{itm.name}}
                                </option>
                            </select>
                        </td>
                        <td>
                            <input v-else type="text" class="check-input" placeholder="备注"
                                   v-model="item.remark">
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <div class="inner-footer">
        <button class="btn-xl-def" @click='closeOnly'>取消</button>
        <ajax-button class="btn-xl-imp" @click='applyScrap'>发起报废申请</ajax-button>
    </div>
</template>

<style lang='less' scoped>
    @import '../../../../../public/css/variable.less';

</style>
