<script>



import cfg from './cfg.js'
import tabOne from './tabOne'
import tabTwo from './tabTwo'
import tabThree from './tabThree'
import tabFour from './tabFour'

export default {
    components: {
        tabOne,
        tabTwo,
        tabThree,
        tabFour,
    },
    ready() {

    },
    data() {
        return {
            tabOneConfig:{
                show: false,
                width: '100%',
                height: '100%',
                title: '客户报价单',
            },
            tabTwoConfig:{
                show: false,
                width: '100%',
                height: '100%',
                title: '客户报价单',
            },
            tabThreeConfig:{
                show: false,
                width: '100%',
                height: '100%',
                title: '销售价格表',
            },
            tabFourConfig:{
                show: false,
                width: '100%',
                height: '100%',
                title: '销售失效价格表',
            },
            leftItemCfg: cfg.leftItemCfg,
            listObj: cfg.listParam,
            tableData: [],
            docData:{
                tabIndex :'',
                docNo    :'',
            },
            inventoryData:{
                inventoryCode:'',
                tabIndex :'',

            },
            radioObj: {},
            tabIndex:"tab1",
            pricingDetail:{
                header:{},
                body:[],
            },
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
        addNewPricing(){
            this.addConfig.show = true ;
        },
        closeNewModal(){
            this.addConfig.show = false;
            this.$broadcast("_RESETLIST");
			this.tableData = [];
        },
        closeCheckModal(){
            this.tabOneConfig.show = false;
            this.tabTwoConfig.show = false;
            this.tabThreeConfig.show = false;
            this.tabFourConfig.show = false;
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
        // table返回的操作参数
        operate(type, item) {
        },
        href(item, type) {
            console.log(1, item)
            if(this.tabIndex == 'tab1'){
            this.docData.docNo  = item.docNo;
            this.$http.post(__URL.sale + 'pricing/getDoc',this.docData).then(
                    (res) => {
                this.pricingDetail.header = res.data.data.header;
                this.pricingDetail.body = res.data.data.dataList;
                this.tabOneConfig.show = true;
            });
        }
            if(this.tabIndex == 'tab2'){
                this.docData.docNo  = item.docNo;
                this.$http.post(__URL.sale + 'pricing/getDoc',this.docData).then(
                        (res) => {
                    this.pricingDetail.header = res.data.data.header;
                    this.pricingDetail.body = res.data.data.dataList;
                    this.tabTwoConfig.show = true;
                });
            }
            if(this.tabIndex == 'tab3'){
                this.inventoryData.inventoryId = item.inventoryId;
                this.$http.post(__URL.sale + 'pricing/getInventory',this.inventoryData).then(
                        (res) => {
                    this.pricingDetail.header = res.data.data.header;
                    this.pricingDetail.body = res.data.data.dataList;
                    this.tabThreeConfig.show = true;
                });
            }
            if(this.tabIndex == 'tab4'){
                this.inventoryData.inventoryId = item.inventoryId;
                this.$http.post(__URL.sale + 'pricing/getInventory',this.inventoryData).then(
                        (res) => {
                    this.pricingDetail.header = res.data.data.header;
                    this.pricingDetail.body = res.data.data.dataList;
                    this.tabFourConfig.show = true;
                });
            }
        },
        getFilter(item,obj) {
            if(obj && obj.inventoryId != undefined) {
                        item.inventoryId = obj.inventoryId;
                }
             if(obj && obj.yearMonth != undefined) {
                    item.yearMonth = obj.yearMonth;
            }
                if(obj && obj.inventoryCategoryCode != undefined) {
                    item.inventoryCategoryCode = obj.inventoryCategoryCode;
            }
            this.getList(item);
        },
        /* 数据请求 */
        getList(obj) {
            this.tableParam = obj
            this.$http.post(__URL.sale + 'pricing/detail/list', obj).then(
                (res) => {
                    this.tableData = res.data.data.dataList;
                    this.tableTotal=res.data.data.totalCount;
                }
            )
        },
        clearTable(uid,obj){
            this.tableData = [];
            this.tabIndex = uid;
            if(uid == 'tab1'){
                this.docData.tabIndex = 1;
                this.inventoryData.tabIndex = 1;
            }
            if(uid == 'tab2'){
                this.docData.tabIndex = 2;
                this.inventoryData.tabIndex = 2;
            }
            if(uid == 'tab3'){
                this.docData.tabIndex = 3;
                this.inventoryData.tabIndex = 3;
            }
            if(uid == 'tab4'){
                this.docData.tabIndex = 4;
                this.inventoryData.tabIndex = 4;
            }

        },
        // 分页回调
        changePage(item){
            this.tableParam.pageIndex=item.pageIndex;
            this.tableParam.pageSize=item.pageSize;
            this.$http.post(__URL.sale + 'customer/pricing/detail/list', this.tableParam).then(
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
            if(cfg.leftItemCfg.tabCfg.select == 'tab1' || cfg.leftItemCfg.tabCfg.select == 'tab2'){
                return cfg.tableCfg1;
            }else{
                return cfg.tableCfg2;
            }
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
    },
//    watch:{
//        leftItemCfg:{
//            handler(val){
//                if(val.tabCfg.select == 'tab1'){
//                    val.listCfg.hasChild = false
//                }else{
//                    val.listCfg.hasChild = true
//                }
//            },
//            deep:true
//        }
//    }
}
</script>
<template>
    <container>
        <div class="body_item">
            <div class="left_item">
                <new-app :config='leftItemCfg' @tab='clearTable' @cb='getFilter'></new-app>
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

    <inner :config='tabOneConfig'>
        <tab-one  :pricing-detail="pricingDetail" @refresh="closeCheckModal"  :show.sync="tabOneConfig.show"></tab-one>
    </inner>

    <inner :config='tabTwoConfig'>
        <tab-two   :pricing-detail="pricingDetail" @refresh="closeCheckModal"  :show.sync="tabTwoConfig.show"></tab-two>
    </inner>

    <inner :config='tabThreeConfig'>
        <tab-three   :pricing-detail="pricingDetail" @refresh="closeCheckModal"  :show.sync="tabThreeConfig.show"></tab-three>
    </inner>

    <inner :config='tabFourConfig'>
        <tab-four   :pricing-detail="pricingDetail" @refresh="closeCheckModal"  :show.sync="tabFourConfig.show"></tab-four>
    </inner>

</template>

