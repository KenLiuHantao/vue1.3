<script>

    import applyscrap from './applyScrap.vue'

    export default{
        data(){
            return {
                returnInfo: {
                    "header": {
                        "docNo": "",
                        "docDate": "",
                        "departmentName": "",
                        "employeeName": "",
                        "demandDocNo": "",
                        "sourceDocNo": "",
                        "warehouseName": "",
                    },
                    "dataList": []
                },

                scrapCfg: {
                    show: false,
                    title: "报废申请单",
                },

                tipsCfg: {
                    show: false,
                    content: '',
                    type: 'warning'
                },

                ids: [],

                selectAll: false
            }
        },

        props: ['docNo', 'sourceType'],

        components: {
            applyscrap,
        },

        ready() {
            this.$http.get(__URL.manufacture + 'production/material/return/inner/detail/' + this.docNo).then(
                (res) => {
                    this.returnInfo = res.data.data;
                }
            )
        },

        methods: {
            scrap(){
                if (this.check()) {
                    this.scrapCfg.show = true;
                }
            },

            check(){
                if (this.ids.length === 0) {
                    this.setWarningSuccess("请至少选择一条记录进行报废");
                    return false;
                }
                return true;
            },

            setWarningSuccess(data) {
                this.tipsCfg.show = true;
                this.tipsCfg.content = data;
                this.tipsCfg.type = "failure";
            },

            close(val) {
                this.$emit('refresh', val);
            },

            checkedAll() {
                var _this = this;
                if (this.selectAll) {//实现反选
                    _this.ids = [];
                } else {//实现全选
                    _this.ids = [];
                    this.returnInfo.dataList.forEach(function (item) {
                        _this.ids.push(item.recordId);
                    });
                }
            }
        },

        watch: {
            'ids': {
                handler: function (val, oldVal) {
                    this.selectAll = this.ids.length === this.returnInfo.dataList.length;
                },
                deep: true
            }
        }
    }


</script>
<template>
    <warning :config="tipsCfg"></warning>
    <div class="inner-wrapper">
        <div class="inner-content">
            <h2 class="tag two-tag"><label>生产退料信息</label><label class="ft-14">生产退料单号: {{docNo}}</label></h2>

            <div class="inner-item form-box">
                <div class="form-group">
                    <label>生产班组:</label>
                    <p>{{returnInfo.header.departmentName}}</p>
                </div>
                <div class="form-group">
                    <label>申请人:</label>
                    <p>{{returnInfo.header.employeeName}}</p>
                </div>
                <div class="form-group">
                    <label>日期:</label>
                    <p>{{returnInfo.header.docDate}}</p>
                </div>
                <div class="form-group">
                    <label>生产订单号:</label>
                    <p>{{returnInfo.header.demandDocNo}}</p>
                </div>
                <div class="form-group">
                    <label>生产补料单号:</label>
                    <p>{{returnInfo.header.sourceDocNo}}</p>
                </div>
                <div class="form-group">
                    <label>仓库:</label>
                    <p>{{returnInfo.header.warehouseName}}</p>
                </div>
            </div>

            <div class="inner-item">
                <table class="inner-table mt-15">
                    <thead>
                    <tr>
                        <th width="30px"><input type="checkbox" v-model="selectAll" @click="checkedAll"/></th>
                        <th width="15%">货品信息</th>
                        <th width="10%" v-if="sourceType==2">生产用量</th>
                        <th width="10%" v-if="sourceType==1">补料数量</th>
                        <th width="10%" v-if="sourceType==2">领料数量</th>
                        <th width="10%">已退数量</th>
                        <th width="10%">应退数量</th>
                        <th width="10%">单位</th>
                        <th width="10%">退料原因</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for='item in returnInfo.dataList'>
                        <td><input type="checkbox" :value="item.recordId" v-model="ids"/></td>
                        <td>
                            <div class="show-wrap">
                                <p>编码:{{item.inventoryCode}}</p>
                                <p>名称:{{item.inventoryName}}</p>
                                <p>规格型号:{{item.inventorySpec}}</p>
                            </div>
                        </td>
                        <td v-if="sourceType==2">
                            <p>{{item.productQuantity}}</p>
                        </td>
                        <td v-if="sourceType==1">
                            <p>{{item.supplyQuantity}}</p>
                        </td>
                        <td v-if="sourceType==2">
                            <p>{{item.pickQuantity}}</p>
                        </td>
                        <td>
                            <p>{{item.returnedQuantity}}</p>
                        </td>
                        <td>
                            <p>{{item.lastQuantity}}</p>
                        </td>
                        <td>
                            <p>{{item.unitName}}</p>
                        </td>
                        <td>
                            <p>{{item.reasonName}}</p>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <div class="inner-footer">
        <button class="btn-xl-def" @click='close("")'>取消</button>
        <ajax-button class="btn-xl-imp" @click='scrap' :disabled="ids.length == 0">申请报废</ajax-button>
    </div>

    <inner :config='scrapCfg'>
        <applyscrap :ids="ids" :cfg="scrapCfg" @refresh='close'></applyscrap>
    </inner>

</template>

<style lang='less' scoped>
    @import '../../../../../public/css/variable.less';

</style>
