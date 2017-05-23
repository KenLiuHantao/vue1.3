<script>
    import mix from '../referCommon/refer.js'

    /*
     title:选取销售订单

     配置:
     config:{
         show:false, //弹框显示 true|false 必填
         },

     回调：
     cb(val)

     */
    export default {
        mixins: [mix],
        data(){
            return {
                //多选部门弹框配置
                modalCfg: {
                    show: this.config.show || false,
                    width: '860px',
                    height: 'auto',
                    header: '销售订单',
                    btn: [{
                        name: '取消',
                        emit: 'quite'
                    }, {
                        name: '确定',
                        emit: 'sure'
                    }],
                },
            }
        },
        methods: {
            getCateData(){
                let param = {
                    "customerCategoryCode": "",
                    "keyWord": this.keyWord,
                }
                this.$http.post(__URL.sale + 'salesOrder/findRefCustomerCategory', param).then(
                    res => {
                        if (res.data.success) {
                            this.cateData = res.data.data.dataList
                        }
                    })
            },
            getTableData(item, index){
                this.currentUl = index
                let param = {
                    "customerCategoryCode": item,
                    "key": this.keyWord
                }
                this.$http.post(__URL.sale + '/salesOrder/findRef', param).then(
                    res => {
                        if (res.data.success) {
                            this.tableData = res.data.data.dataList
                        }
                    }
                )
            },

        },
    }
</script>
<template>
    <modal :config="modalCfg" @quite="quite" @sure="sure" @close="quite">
        <div class="check-wrap ">
            <div class="left-wrap">
                <div class="common-head ">
                    <!--<div>
                        <span class="icon icon-hp_list__add"></span>新增
                    </div>-->
                    <div class="search-input">
                        <input type="text" placeholder="客户/业务员/销售单号/客户订单号" v-model="keyWord" @keyup.enter="searchData">
                        <i class="icon-modal__serach" @click="searchData"></i>
                    </div>
                </div>
                <ul class="left-content modal-ul">
                   <!-- <li @click="getTableData('',-1)" :class="{'active':currentUl == -1}">
                        全部
                    </li>-->
                    <li v-for="item in cateData" :class="{'active':currentUl == $index}"
                        @click="getTableData(item.customerCategoryCode,$index)">
                        {{item.customerCategoryName}}

                    </li>
                </ul>
            </div>
            <div class="right-wrap">
                <div class="common-head left-head">
                    <!-- <div><span class="icon-in"></span>导入</div>
                     <div><span class="icon-out"></span>导出</div>-->
                </div>
                <div class="left-content">
                    <table class="modal-table">
                        <thead>
                        <tr>
                            <th width="10%"></th>
                            <th width="20%" class="text-left">销售单号</th>
                            <th width="15%">业务员</th>
                            <th width="15%">货品信息</th>
                            <th width="10%">数量</th>
                            <th width="15%">含税价格</th>
                            <th width="15%">交货日期</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="item in tableData" @click="checkThisLine(item)">
                            <td class="no-padding">
                                <input type="radio" :value="item" v-model="chooseRadio">
                            </td>
                            <td class="text-left">{{item.docNo}}</td>
                            <td>{{item.employeeName}}</td>
                            <td>{{item.inventorySpec}}</td>
                            <td>{{item.quantity}}</td>
                            <td>{{item.taxUnitPrice}}</td>
                            <td>{{item.deliveryDate}}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </modal>
</template>
<style lang="less" scoped>
    @import '../../../public/css/variable.less';
    @import '../../../public/css/referCommon.less';
</style>

