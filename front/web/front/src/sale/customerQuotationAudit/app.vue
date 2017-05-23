<script>



import cfg from './cfg.js'
import checkQuotation from './checkQuotation'

export default {
    components: {
        checkQuotation
    },
    ready() {
          //初始化时拿到币种列表
    },
    data() {
        return {
            leftItemCfg: cfg.leftItemCfg,
            listObj: cfg.listParam,
            checkConfig:{
                show: false,
                width: '100%',
                height: '100%',
                title: '客户报价单',
            },
            tableData: [],
            radioObj: {},
            quotationDetail:{},
            pageCfg:{
                'pageSize': 50,
                'pageIndexName': 'pageIndex',
                'pageSizeName': 'pageSize',
                'jump':true
            },
            tableTotal:0,
            tableParam:{}
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
        closeCheckModal(){
         this.checkConfig.show = false
            this.$broadcast("_RESETLIST");
			this.tableData = [];
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
        // table返回的操作参数 操作栏执行
        operate(type, item) {
            console.log('app', type)
        },
        // table里面的链接
        href(item, type) {
             if(type === "docNo"){
                   var docNo  = item.docNo

               this.$http.get(__URL.sale + 'customer/quotation/getDoc/'+docNo).then(
                (res) => {
                     this.quotationDetail = res.data.data;
                     this.checkConfig.show = true;
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
//            this.tableParam = obj
//            this.$http.post(__URL.sale + 'customer/quotation/detail/list', obj).then(
//                (res) => {
//                    this.tableData = res.data.data.dataList;
//                    this.tableTotal=res.data.data.totalCount;
//                }
//            )
            switch(this.leftItemCfg.tabCfg.select){
                case 'tab1':
                    this.findUnauditList(obj);
                    break;
                case "tab2":
                    this.findAuditList(obj);
                    break;
            }
        },
        //未审核列表
        findUnauditList(obj){
            this.$http.post(__URL.sale + 'customer/quotation/findUnauditList', obj).then(
                    (res) => {
                this.tableData = res.data.data.dataList;
            this.tableTotal=res.data.data.totalCount;
        });
        },
        //已审核列表
        findAuditList(obj){
            this.$http.post(__URL.sale + 'customer/quotation/findAuditList', obj).then(
                    (res) => {
                this.tableData = res.data.data.dataList;
            this.tableTotal=res.data.data.totalCount;
        });
        },
        clearTable(uid,obj){
            this.tableData = []
        },
        // 分页回调
        changePage(item){
            this.tableParam.pageIndex=item.pageIndex;
            this.tableParam.pageSize=item.pageSize;
            this.$http.post(__URL.sale + 'customer/quotation/detail/list', this.tableParam).then(
                (res) => {
                this.tableData = res.data.data.dataList;
                this.boxGroup = [];
                this.tableTotal=res.data.data.totalCount;
                if(res.data.data.dataList.length>0 && res.data.data.dataList[0].status==1){
                    this.boxGroup=JSON.parse(JSON.stringify(res.data.data.dataList))

                }
            })
        }
    },
    computed: {
        /* 参数获取 */
        tableUrl() {
            return cfg.table.baseParams.url
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
            <div :class="{'have_footer': tableTotal > pageCfg.pageSize}" class="right_item">
                <div class="item_head btn-ic">
                    <a href="javascript:;">
                        <!--<i class='icon-hp_list__add'></i>test-->
                    </a>
                </div>
                <div class="item_body">
                     <vtable :radio.sync='radioObj' :config='tableCfg' :data='tableData' @op='operate' @link='href'>
                    </vtable>
                </div>
                <div v-if="tableTotal > pageCfg.pageSize" class="item_footer">
                    <pagination :total='tableTotal' :config='pageCfg' @cb='changePage'></pagination>
                </div>
            </div>
        </div>

    </container>

    <inner :config='checkConfig'>
        <check-quotation :quotation-detail="quotationDetail"  :show.sync="checkConfig.show" @refresh="closeCheckModal"></check-quotation>
    </inner>

</template>

