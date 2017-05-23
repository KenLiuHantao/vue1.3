<script>
/*
    config: {
        show:false, //弹框显示 true|false 必填
    },
    //回调函数
    @cb(val)
*/
export default {
    props:{
        config: Object,
        supplierCode: String
    },
    ready() {
        this.keyWord = ''
        this.getCateData()
        this.getTableData('', -1)
    },
    data() {
        return {
            modalCfg: {
                show: this.config.show || false,
                width: '1200px',
                height: 'auto',
                header: '选取采购单',
                btn: [{
                    name: '取消',
                    emit: 'quite'
                }, {
                    name: '确定',
                    emit: 'sure'
                }],
            },
            cateData: [], //分类列表数据
            tableData: [], //详细列表数据
            currentUl: '-1', //当前操作分类
            chooseRadio: '', //当前选中列
            keyWord: ''  //搜索关键字

        }
    },
    methods: {
        getCateData() {
           let param = {
               'pageIndex': 0,
               'pageSize': 0,
               'supplierCode': this.supplierCode,
               'supplierName': '',
               'keyWord': this.keyWord
            }
            this.$http.post(__URL.warehouse + 'inbound/refer/supplier', param).then(res => {
                if(res.data.success){
                    this.cateData = res.data.data.dataList;
                }
            });
        },
        getTableData(item, index) {
            this.currentUl = index
            let param = {
                'pageIndex': 0,
                'pageSize': 0,
                'supplierCode': item,
                'supplierName': '',
                'keyWord': this.keyWord
            }
            this.$http.post(__URL.warehouse + 'inbound/refer/list', param).then(res => {
               if(res.data.success){
                   this.tableData = res.data.data.dataList;
               }
            });
        },
        searchData() {
            this.getCateData()
            this.getTableData(this.supplierCode, -1)
        },
        quite() {
            this.config.show = false
            this.chooseRadio = ''
        },
        sure() {
            this.config.show = false
            this.$emit('cb', this.chooseRadio)
        },
        checkThisLine(item){
            this.chooseRadio = item
        }
    },
    watch: {
        config:{
             handler: function (val, oldVal) {
                this.modalCfg.show = val.show
                if(val.show == true && val.data &&  val.data != '') {
                    this.chooseRadio = val.data
                }
             },
             deep: true
        },
        supplierCode: {
            handler: function (val, oldVal) {
                this.searchData();
            },
            deep: true
        },
        keyWord(val,oldval) {
            if(val.trim() == '') {
                this.getCateData()
                this.getTableData('',-1)
            }
        },
        modalCfg:{
            handler: function (val, oldVal) {
                this.config.show = val.show
             },
             deep: true
        }
    }
}
</script>
<template>
    <modal :config="modalCfg" @quite="quite" @sure="sure">
        <div class="check-wrap ">
            <div class="left-wrap">
                    <div class="common-head left-head">
                        <div>
                            <!--<span class="icon icon-hp_list__add"></span>新增-->
                        </div>
                        <div class="search-input">
                            <input type="text" placeholder="供应商" v-model="keyWord" @keyup.enter="searchData">
                            <i class="icon-search" @click="searchData"></i>
                        </div>
                    </div>
                    <ul class="left-content modal-ul">
                        <li @click="getTableData('',-1)" :class="{'active':currentUl == -1}">
                            全部
                        </li>
                        <li v-for="item in cateData" :class="{'active':currentUl == $index}" @click="getTableData(item.supplierCode, $index)">
                            {{item.supplierName}}
                        </li>
                    </ul>
            </div>
            <div class="right-wrap">
                    <div class="common-head left-head">
                        <!--<div><span class="icon-in"></span>导入</div>-->
                        <!--<div><span class="icon-out"></span>导出</div>-->
                    </div>
                    <div class="left-content">
                        <table class="modal-table">
                            <thead>
                                <tr>
                                    <th width="5%"></th>
                                    <th width="25%" class="text-left">采购单号</th>
                                    <th width="25%">货品信息</th>
                                    <th width="15%">入库数量</th>
                                    <th width="10%">单位</th>
                                    <th width="20%">仓库</th>
                                    <th width="26%">销售单号</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in tableData" @click.stop='checkThisLine(item)'>
                                    <td>
                                        <input type="radio" :value="item" v-model="chooseRadio">
                                    </td>
                                    <td class="text-left">
                                        <a href="javascript:;" :title='item.srcDocNo'>{{item.srcDocNo}}</a>
                                    </td>
                                    <td>
                                        <p><label>编码: </label><label>{{item.inventoryCode}}</label></p>
                                        <p><label>名称: </label><label>{{item.inventoryName}}</label></p>
                                        <p><label>型号: </label><label>{{item.inventorySpec}}</label></p>
                                    </td>
                                    <td>{{item.quantity}}</td>
                                    <td>{{item.unitName}}</td>
                                    <td>{{item.warehouseName}}</td>
                                    <td>{{item.salesOrderDocNo}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
            </div>
        </div>
    </modal>
</template>
<style lang="less" scoped>
    @import '../../../../../public/css/variable.less';
    @import '../../../../../public/css/referCommon.less';
</style>

