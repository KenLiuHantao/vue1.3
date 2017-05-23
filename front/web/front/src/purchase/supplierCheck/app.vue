<script>



import Cfg from './cfg.js'
import suppliercheckdetail from './supplierCheckDetail'
import suppliercheck from './supplierCheck'

import outsourcedetail from '../outsource/editPurchase'
import orderdetail from '../purOrder/editPurchase'

export default {
    components: {
        suppliercheck,
        suppliercheckdetail,
        orderdetail,
        outsourcedetail
    },
    ready() {

    },
    data() {
        return {
            leftItemCfg: Cfg.leftItemCfg,
            listObj: Cfg.listParam,
            tableData: [],
            radioObj: [],
            checkDetailCfg:{
                show:false,
                width: '100%',
                height: '100%',
                title:'供应商对账单'
            },
            checkConfig:{
                show:false,
                width: '100%',
                height: '100%',
                title:'新建供应商对账单'
            },
            tipsCheck:{
                show:false,
                type:'warning',
                content:'必须勾选中才能对账',
                showTime:500
            },
            tipsCheckSameSupplier:{
                show:false,
                type:'warning',
                content:'必须选中同一供应商才能对账',
                showTime:500
            },
            warnCfg:{
                show:false,
                type:'success',
                content:''
            },
            supplierCfg:{
                show:false
            },
            referPurchaseDocNo:'',
            referOutPurDocNo:'',
            detailConfig:{
                show:false,
                width: '100%',
                height: '100%',
                title:'采购单'
            },
            outDetailConfig:{
                show:false,
                width: '100%',
                height: '100%',
                title:'委外采购单'
            },
            cfg:Cfg
        }
    },
    methods: {
        /* 公用方法 */
        assign(base, target) {
            let tk = Object.keys(target)

            for (let i in base) {
                if (tk.indexOf(i) != -1) {
                    target[i] = base[i]
                }
            }
        },
        /* 重置对象 */
        initListObj(obj) {
            let init = {
                "pageIndex": 0,
                "pageSize": 0,
                "supplierCode": obj.supplierCode != undefined ? obj.supplierCode : this.listObj.supplierCode,
                "yearMonth": obj.yearMonth != undefined ? obj.yearMonth : this.listObj.yearMonth
            }
            return init
        },
        // table返回的操作参数
        operate(type, item) {
            console.log('app', type)
        },
        href(item, type) {
            if(Cfg.leftItemCfg.tabCfg.select == 'tab1'){

                //区分采购还是委外采购 2是委外采购
                if(item.docSubType == '21'|| item.docSubType =='22'){
                    this.outDetailConfig.show = true;
                    this.referOutPurDocNo = item.purchaseDocNo;
                }else{
                    this.detailConfig.show = true;
                    this.referPurchaseDocNo = item.purchaseDocNo;
                }
            }else{
                var param = {
                    docNo:item.docNo
                };
                this.$http.post(__URL.purchase + 'suppliercheckinbounds/checked/purchaseandinbounddetail',param).then(
                    (res)=>{
                        res.data.data.checkDocNo = item.docNo;
                        this.checkList = res.data.data;
                        this.checkDetailCfg.show = true;
                    }
                )
            }
        },
        getFilter(item,obj) {
            this.radioObj = [];
            if(obj && obj.supplierCode){
                item.supplierCode = obj.supplierCode;
                item.currencyCode = obj.currencyCode;
            }
            this.getList(item)
        },
        /* 数据请求 */
        getList(obj) {
            this.radioObj = [];
            this.tableData = [];
            if(Cfg.leftItemCfg.tabCfg.select == 'tab1'){
                if(obj.supplierCode){
                 this.$http.post(__URL.purchase + 'suppliercheckinbounds/uncheck/purchaselist', obj).then(
                    (res) => {
                        this.tableData = res.data.data.dataList;
                        this.cfg.supplierUncheckTableCfg.totalShow[1][0].value = this.tableData[0].totalPurchaseTaxAmounts;
                        this.cfg.supplierUncheckTableCfg.totalShow[1][1].value = this.tableData[0].totalPurchaseTodoAmounts;
                        this.cfg.supplierUncheckTableCfg.totalShow[1][2].value = this.tableData[0].totalPurchaseDoneAmounts;
                        this.cfg.supplierUncheckTableCfg.totalShow[1][3].value = this.tableData[0].totalThisTimeTaxAmount;
                        for(let i =0;i<this.tableData.length;i++){
                            this.radioObj.push(this.tableData[i]);
                        }
                    }
                )
                }
           }else{
                 this.$http.post(__URL.purchase + 'suppliercheckinbounds/checked/supplierchecklist', obj).then(
                    (res) => {
                        this.tableData = res.data.data.dataList
                    }
                )
           }
        },
        refreshOnly(){
            this.$broadcast('_RESETLIST');
        },
        //设置提示信息
        setWarningSuccess(type,data){
            this.warnCfg.show = true
            this.warnCfg.content = data
            this.warnCfg.type = type
        },
        refresh(type,tips){
            this.setWarningSuccess(type,tips)
            this.$broadcast('_RESETLIST');
            this.tableData = []
            this.checkData = []
        },
        openRef(emit){
            if(emit == 'supplier') {
                this.supplierCfg.show = true;
            }
        },
        check(){

            if(this.radioObj.length == 0){
                this.tipsCheck.show = true;
                return;
            }
            var purchaseDocNos = [];
            for(var i = 0;i<this.radioObj.length;i++){
                if(this.radioObj[0].supplierCode == this.radioObj[i].supplierCode && this.radioObj[0].currencyCode == this.radioObj[i].currencyCode){
                    purchaseDocNos.push(this.radioObj[i].purchaseDocNo);
                }else{
                    this.tipsCheckSameSupplier.show = true;
                    return;
                }
            }
            var param = {
                purchaseDocNos:purchaseDocNos,
                supplierCode:this.radioObj[0].supplierCode,
                currencyCode:this.radioObj[0].currencyCode,
                yearMonth:this.radioObj[0].yearMonth
            };
            this.$http.post(__URL.purchase + 'suppliercheckinbounds/uncheck/purchaseandinbounddetail', param).then(
                (res) => {
                    this.checkList = res.data.data;
                    this.checkConfig.show = true;
                }
            );

        },
        //供应商参照回调
        supplierSure(val){
            for(var index in this.leftItemCfg.filterCfg){
                if(this.leftItemCfg.filterCfg[index].key=='supplierName'){
                    this.leftItemCfg.filterCfg[index].value = val.supplierName;
                    this.leftItemCfg.filterCfg[index].supplierCode = val.supplierCode;
                }
            }

            //this.filterCfg.supplierName = val.supplierName;
        },
        fresh() {
            /*this.innerCfg.show = false*/
            this.reset()
        },
        closeOrderDetail(){
            this.detailConfig.show=false;
            this.outDetailConfig.show = false;
            this.refresh()
        },
        reset() {
            this.$broadcast('_RESETLIST')
            this.tableData=new Array
        },
        clearTable(uid,obj){
            this.tableData = []
        }
    },
    computed: {
        /* 参数获取 */
        tableUrl() {
            return Cfg.table.baseParams.url
        },
        tableCfg() {
           if(Cfg.leftItemCfg.tabCfg.select == 'tab1'){
                return Cfg.supplierUncheckTableCfg
           }else{
                return Cfg.supplierCheckedTableCfg
           }
        },
        tableParams() {
            let param = {
                "pageIndex": 0,
                "pageSize": 0,
                "supplierCode": this.listObj.supplierCode,
                "yearMonth": this.listObj.yearMonth
            }
            return param
        }
    }
}

</script>
<template>
    <container>
        <div class="body_item">
            <div class="left_item">
                <new-app :config='leftItemCfg' @tab='clearTable' @cb='getFilter'  @reference='openRef' @filtcb="fresh"></new-app>
            </div>
            <div class="right_item">
                <div class="item_head btn-ic">
                    <a href="javascript:;" v-if="leftItemCfg.tabCfg.select == 'tab1'" @click="check">
                        <i class='icon-watch_account'></i>对账
                    </a>
                </div>
                <div class="item_body">
                    <vtable :checkbox.sync='radioObj' :config='tableCfg' :data='tableData' @op='operate' @link='href'>
                    </vtable>
                </div>
            </div>
        </div>
    </container>
    <refer-supplier :config="supplierCfg" @cb="supplierSure"></refer-supplier>
    <warning :config="tipsCheck"></warning>
    <warning :config="tipsCheckSameSupplier"></warning>
    <inner :config='checkConfig'>
        <suppliercheck :orderdetail="checkList" @refresh="refresh" @refreshonly='refreshOnly' :suppliercheckcfg.sync="checkConfig"></suppliercheck>
    </inner>
    <inner :config="checkDetailCfg">
        <suppliercheckdetail :orderdetail="checkList" @refreshonly='refreshOnly' :suppliercheckcfg.sync="checkDetailCfg"></suppliercheckdetail>
    </inner>

    <inner :config='detailConfig'>
        <orderdetail  :docno="referPurchaseDocNo" :config.sync="detailConfig" @refresh='closeOrderDetail'></orderdetail>
    </inner>

    <inner :config='outDetailConfig'>
        <outsourcedetail  :docno="referOutPurDocNo" :config.sync="outDetailConfig" @refresh='closeOrderDetail'></outsourcedetail>
    </inner>
    <warning :config="warnCfg"></warning>
</template>
