<script>

import cfg from './cfg.js'
import checkInvoice from './checkInvoice'

export default {
    components: {
        checkInvoice,
    },
    ready() {
    },
    data() {
        return {
            leftItemCfg: cfg.leftItemCfg,
            listObj: cfg.listParam,
            tableData: [],
            checkboxArray: [],
            docNos:[],
            invoiceDocNo:"",
            isShowInvoice:false,
            workflow:{no:0},
            inventoryCfg:{
                show:false
            },
            checkInvoiceCfg:{
                show:false,
                title:"采购收票",
            },
            warCfg: {
                show: false,
                type: "warning",
                showtime: 2000,
                content: '提示消息'
            },
            alertCfg: {
                show: false,
                type: "warning",
                msg: '提示消息',
                sure:true,
                quite:false
            }
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
                "productDocNo":'',
                "inventoryCode": "",
                "beginDeliveryDate": "",
                "endDeliveryDate": "",
                "pageIndex": 0,
                "pageSize": 0,
                "processCode": obj.processCode,
                "yearWeek": obj.yearWeek != undefined ? obj.yearWeek : this.listObj.yearWeek
            }
            return init
        },
        href(item, type) {
            if(type == 'docNo'){
               this.invoiceDocNo = item.docNo;
               if(cfg.leftItemCfg.tabCfg.select == 'tab3'){
                    this.workflow.no = 3
                    this.openCheckInvoice();
               }
                if(cfg.leftItemCfg.tabCfg.select == 'tab4'){
                    this.workflow.no = 4
                    this.openCheckInvoice();
                }
            }
        },
        getFilter(item,obj) {
            if(obj && obj.supplierCode){
                item.supplierCode = obj.supplierCode;
            }
            this.getList(item)
        },
        /* 数据请求 */
        getList(obj) {
            this.tableData = [];
              this.$http.post(__URL.financial + 'purchase/invoice/list', obj).then(
                            (res) => {
                                this.tableData = res.data.data.dataList

                            }
                )

        },
        showMsg(type,msg){
            this.warCfg.show = true;
            this.warCfg.type=type;
            this.warCfg.content=msg;
        },
        // table返回的操作参数
        operate(type, item) {
            let docNo = item.docNo;
            let recordVersion = item.recordVersion;

            //审核
            if(type == 'audit') {
                this.$http.post(__URL.financial + 'purchase/invoice/audit',{"docNo":docNo,"recordVersion":recordVersion}).then(
                    (res) => {
                        if(res.data.success){
                            this.showMsg('success','审核成功');
                            this.$emit('refresh')
                        }else {
                            this.showMsg('warning',res.data.errMsg);
                        }
                    }
                 )
            }
            //弃审
            if(type == 'unaudit') {
                this.$http.post(__URL.financial + 'purchase/invoice/unaudit',{"docNo":docNo,"recordVersion":recordVersion}).then(
                    (res) => {
                        if(res.data.success){
                            this.showMsg('success','弃审成功');
                            this.$emit('refresh')
                        }else {
                            this.showMsg('warning',res.data.errMsg);
                        }
                    }
                )
            }

            this.refresh();
        },

        openCheckInvoice(){
            this.checkInvoiceCfg.show=true;
        },
         closeCheckInvoice(){
            this.checkInvoiceCfg.show=false;
        },
        //打开新增页
        addInvoice(){
            //检验供应商
              let supplierName = '';
            if(this.checkboxArray.length <= 0){
                this.warCfg.show=true;
                this.warCfg.content = "没有选中行"
                return;
            }
           let docNoList = []
           let isSame = true;
           this.checkboxArray.forEach((item) => {
                if(supplierName != '' && supplierName != item.supplierName){
                    isSame = false;
                }
                supplierName = item.supplierName;
                docNoList.push(item.docNo);
            })

            if(!isSame){
                this.alertCfg.show=true;
                this.alertCfg.msg = "选择行的供应商不同,不能合并开票,请选择相同供应商下单"
                this.alertCfg.item = docNoList;
                return;
            }
            this.docNos = docNoList;
            this.openNewInvoice();
        },
        alertCb(){
            this.alertCfg.show=false;
        },
        closeCheck(){
            this.checkInvoiceCfg.show=false;
            this.refresh()
        },
        refresh(){
            this.$broadcast('_RESETLIST');
            this.tableData = [];
        },
        clearTable(uid,obj){
            this.tableData = []
        }
    },
    computed: {
        /* 参数获取 */
        tableUrl() {
            return cfg.table.baseParams.url
        },
        tableCfg() {

           this.tableData=[];
           if(cfg.leftItemCfg.tabCfg.select == 'tab1'){
                this.isShowInvoice=true;
                return cfg.tab1TableCfg
           }else if(cfg.leftItemCfg.tabCfg.select == 'tab2'){
                this.isShowInvoice=false;
                return cfg.tab2TableCfg
           }else if(cfg.leftItemCfg.tabCfg.select == 'tab3'){
                this.isShowInvoice=false;
                return cfg.tab3TableCfg
           }else{
                this.isShowInvoice=false;
                return cfg.tab4TableCfg
           }

        },
        tableParams() {
            let param = {
              "pageIndex": 0,
                "pageSize": 0,
                "recordStatus": 2,
                "supplierCode":this.listObj.supplierCode,
                "yearMonth": this.listObj.yearWeek
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
                <new-app :config='leftItemCfg'  @tab='clearTable' @cb='getFilter' @reference='openRef'></new-app>
            </div>
            <div class="right_item">
                <div class="item_head btn-ic">
                    <a href="javascript:" @click='addInvoice' v-if="isShowInvoice">
                        <i class='icon-invoice__create'></i>开票
                    </a>
                </div>
                <div class="item_body">
                    <vtable :checkbox.sync='checkboxArray' :config='tableCfg' :data='tableData' @op='operate'
                            @link='href'>
                    </vtable>
                </div>
            </div>
        </div>
    </container>

    <!--警告-->
    <warning :config="warCfg"></warning>

    <!--弹出-->
    <alert :config="alertCfg" @cb="alertCb"></alert>

   <!-- 详情内页-->
    <inner :config='checkInvoiceCfg'>
        <check-invoice   :invoice-cfg="checkInvoiceCfg" :doc-no="invoiceDocNo" @refresh='closeCheck'></check-invoice>
    </inner>

</template>
