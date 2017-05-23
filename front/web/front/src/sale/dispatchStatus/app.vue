<script>



import dispatchDoc from './checkDispatchDoc'
import cfg from './cfg.js'

export default {
    components: {
        dispatchDoc
    },
    ready() {

    },
    data() {
        return {
            leftItemCfg: cfg.leftItemCfg,
            dispatchDocCfg:{
                show: false,
                width: '100%',
                height: '100%',
                title: '发货通知单'
            },
            listObj: cfg.listParam,
            tableData: [],
            radioObj: {},
            ajaxLock:true,
            dispatchDocDetail:""
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
                "audit": obj.audit,
                "beginCreateTime": "",
                "docNo": "",
                "endCreateTime": "",
                "inventoryCode": "",
                "inventoryName": "",
                "pageIndex": 0,
                "pageSize": 0,
                "supplierCode": obj.supplierCode,
                "supplierName": obj.supplierName,
                "yearWeek": obj.yearWeek != undefined ? obj.yearWeek : this.listObj.yearWeek
            }
            return init
        },
        // table返回的操作参数
        operate(type, item) {

        },
        href(item, type) {
             if(type === "docNo"){

                   var docNo  = item.docNo
                   this.$http.get(__URL.sale + 'salesDispatch/findOne/'+docNo).then(
                        (res) => {
                             this.dispatchDocDetail = res.data.data;
                              this.dispatchDocCfg.show = true ;
                        }
                     )

             }

        },
        getFilter(item,obj) {
            if(obj && obj.customerCode != undefined) {
                        item.customerCode = obj.customerCode;
                }
            this.getList(item)
        },
        /* 数据请求 */
        getList(obj) {
            switch(this.leftItemCfg.tabCfg.select){
                    case 'tab1':
                        this.getUnAuditList(obj);
                        break;
                    case "tab2":
                        this.getDispatchingList(obj);
                        break;
                     case "tab3":
                        this.getDispatchedList(obj);
                        break;
            }
        },
        //未审核列表
        getUnAuditList(obj){
              this.$http.post(__URL.sale + 'salesDispatch/findUnauditList', obj).then(
                    (res) => {
                        this.tableData = res.data.data.dataList
                    }
                );
        },
        //发货中
        getDispatchingList(obj){
                this.$http.post(__URL.sale + 'salesDispatch/findProcessList', obj).then(
                                (res) => {
                                    this.tableData = res.data.data.dataList
                                }
                            );
        },
        //已发货
        getDispatchedList(obj){
                     this.$http.post(__URL.sale + 'salesDispatch/findDoneList', obj).then(
                                (res) => {
                                    this.tableData = res.data.data.dataList
                                }
                            );
        },
        closeDispatchDoc(){
//              this.noticeConfig.show = false;
              this.dispatchDocCfg.show = false ;
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
        tab() {
            return cfg.leftItemCfg.tabCfg.select;
        },
        tableCfg() {
            return cfg.tableCfg
        },
        tableParams() {
            let param = {
                "entCode": "",
                "params": {
                    "audit": this.listObj.audit,
                    "beginCreateTime": "",
                    "docNo": "",
                    "endCreateTime": "",
                    "inventoryCode": "",
                    "inventoryName": "",
                    "pageIndex": 0,
                    "pageSize": 0,
                    "supplierCode": this.listObj.supplierCode,
                    "supplierName": this.listObj.supplierName,
                    "yearWeek": this.listObj.yearWeek
                },
                "userCode": ""
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
                <new-app :config='leftItemCfg' @tab='clearTable' @cb='getFilter' ></new-app>
            </div>
            <div class="right_item">
                <div class="item_head btn-ic">
                    <a href="javascript:;">
                        <!--<i class='icon-hp_list__add'></i>发货-->
                    </a>
                </div>
                <div class="item_body">
                     <vtable :radio.sync='radioObj' :config='tableCfg' :data='tableData' @op='operate' @link='href'>
                    </vtable>
                </div>
            </div>
        </div>

    </container>

    <inner :config='dispatchDocCfg'>
        <dispatch-doc :tab="tab"  :dispatch-detail="dispatchDocDetail" @refresh='closeDispatchDoc' :show="dispatchDocCfg"></dispatch-doc>
    </inner>


</template>

