<script>



import cfg from './cfg.js'
import initbalance from './newInitBalance.vue'
export default {
    components: {
        initbalance,
    },
    ready() {

    },
    data() {
        return {
            leftItemCfg: cfg.leftItemCfg,
            listObj: cfg.listParam,
            tableData: [],
            checkboxArray: [],
            modalConfig: {
                show: false,
                width: '368px',
                height: 'auto',
                header: '选择期初余额类型'
            },
            detailConfig:{
                show: false,
                width: '100%',
                height: '100%',
                title:'现金期初余额'
            },
            docNo:"",
            dataList:'',
            balanceCategoryCode:'',
            //提示消息
            msgCfg: {
                show: true,
                showtime: 2000,
                content: '提示消息'
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
            },
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
        showMsg(type,msg){
            this.warCfg.show = true;
            this.warCfg.type=type;
            this.warCfg.content=msg;
        },
        /* 重置对象 */
        initListObj(obj) {
            let init = {
                "pageIndex": 0,
                "pageSize": 0,
                "currencyCode": obj.currencyCode!=undefined ? obj.currencyCode:this.listObj.currencyCode,
                "balanceCategoryCode": obj.balanceCategoryCode!=undefined ? obj.balanceCategoryCode:this.listObj.balanceCategoryCode,
                "recordStatus": obj.recordStatus != undefined ? obj.recordStatus : this.listObj.recordStatus
            }
            return init
        },
        // table返回的操作参数
        operate(type, item) {
            if(type =='audit'){
                this.$http.post(__URL.financial + 'init/balance/audit/' , {'docNo':item.docNo,"recordVersion":item.recordVersion}).then(
                    (res) => {
                        this.showMsg('warning',res.data.errMsg);
                        if(res.data.success){
                            this.showMsg('success','审核成功');
                            this.refresh();
                        }
                    }
                );
            } else if (type == 'unaudit') {
                this.$http.post(__URL.financial + 'init/balance/unaudit/' , {'docNo':item.docNo,"recordVersion":item.recordVersion}).then(
                    (res) => {
                        this.showMsg('warning',res.data.errMsg);
                        if(res.data.success){
                            this.showMsg('success','弃审成功');
                            this.refresh();
                        }
                    }
                );
            }
        },
        href(item, type) {
            if(type == 'docNo'){
                this.openDetail(item.docNo);
            }

        },
        getFilter(item,obj) {
            if(obj && obj.currencyCode){
             item.currencyCode = obj.currencyCode;
            }
            if(obj && obj.bankAccount){
                item.bankAccount = obj.bankAccount;
            }
            this.balanceCategoryCode = item.balanceCategoryCode;
            this.getList(item)
        },
        /* 数据请求 */
        getList(obj) {
            this.$http.post(__URL.financial + 'init/balance/list', obj).then(
                (res) => {
                    this.tableData = res.data.data.dataList
                }
            )
        },
        //打开详情页
        openDetail(docNo){
            this.detailConfig.show=true;
            this.docNo=docNo;
            this.detailConfig.title= (this.balanceCategoryCode=="001"?"现金期初余额":"银行存款期初余额");
        },

        //关闭详情页面
        closeDetail(){
            this.detailConfig.show=false;
            this.refresh()
        },
        refresh() {
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
                return this.balanceCategoryCode=="001"? cfg.cashTableCfg1:cfg.bankTableCfg1;
            }else{
                return this.balanceCategoryCode=="001"? cfg.cashTableCfg2:cfg.bankTableCfg2;
            }
        },
        tableParams() {
            let param = {
                "currencyCode":"",
                "balanceCategoryCode":"",
                "pageIndex": 0,
                "pageSize": 0,
                "recordStatus": this.listObj.recordStatus
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
                <new-app :config='leftItemCfg'  @tab='clearTable' @cb='getFilter' @add="openAdd" @reference='openRef'></new-app>
            </div>
            <div class="right_item">
                <div class="item_head btn-ic">

                </div>
                <div class="item_body">
                    <vtable  :config='tableCfg' :data='tableData'  @link='href' @op='operate'>
                    </vtable>
                </div>
            </div>
        </div>
    </container>

    <!--警告-->
    <warning :config="warCfg"></warning>



    <!-- 详情内页-->
    <inner :config='detailConfig'>
        <initbalance  :docno="docNo" :balancecategorycode="balanceCategoryCode"  :detailconfig="detailConfig"  @refresh='closeDetail'></initbalance>
    </inner>
</template>
