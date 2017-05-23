<script>
//import ireturn from './infoReturn.vue'
import rnotice from './returnNotice.vue'
import cfg from './cfg.js'
export default {
    components: {
//        ireturn,
        rnotice
    },
    ready() {

    },
    data() {
        return {
            //左列表配置
            leftItemCfg: cfg.leftItemCfg,
            tableData: [],
            returnData:[],
            returnHeader:'',
            isEdit:true,
            //0未审核，1已审核
            status:0,
            //提示消息弹框
            msgCfg: {
                show: false,
                content: ''
            },
            //新增 退货 内页配置
            salesOutConfig:{
                show: false,
                width: '100%',
                height: '100%',
                title: '销售出库单',
            },
            //销售订单详情 内页配置
            detailConfig:{
            show: false,
            width: '100%',
            height: '100%',
            title: '退货单详情',
        }
        }
    },
    methods: {
        //公用方法
        assign(base, target) {
            let tk = Object.keys(target)

            for (let i in base) {
                if (tk.indexOf(i) != -1) {
                    target[i] = base[i]
                }
            }
        },
        //退货单详情页
        href(item) {
            this.$http.get(__URL.sale + 'salesReturn/findOne/'+item.docNo).then(
                res => {
                    if (res.data.success) {
                        this.returnData = res.data.data.dataList
                        this.returnHeader = res.data.data.header
                        this.detailConfig.show = true
                        if (res.data.data.header.docStatus == 2) {
                            this.isEdit =  true
                            this.salesOutConfig.show = true
                        }
                    } else {
                        this.msgCfg.show = true
                        this.msgCfg.content = res.data.errMsg
                    }
                }
            )
            this.preInfo();
        },
        getFilter(item, obj) {
            if (obj && obj.yearWeek != undefined) {
                item.yearWeek = obj.yearWeek;
            }
            if (obj && obj.customerCode != undefined) {
                item.customerCode = obj.customerCode;
            }
            switch (cfg.leftItemCfg.tabCfg.select) {
                case 'unaudit':
                    this.getUnauditTableData(item);
                    break;
                case 'reject':
                    this.getRejectTableData(item);
                    break;
                case 'wait_receive':
                    this.getWaitReceiveTableData(item);
                    break;
                case 'receive_done':
                    this.getReceiveDoneTableData(item);
                    break;
            }
        },
        //获取未审核列表数据
        getUnauditTableData(param) {
            this.$http.post(__URL.sale + 'salesReturn/findUnauditList', param).then(
                res => {
                    if (res.data.success) {
                        this.tableData = res.data.data.dataList
                        this.status = 0
                    } else {
                        this.msgCfg.show = true
                        this.msgCfg.content = res.data.errMsg
                    }
                }
            )
        },
        //获取已驳回列表数据
        getRejectTableData(param) {
            this.$http.post(__URL.sale + 'salesReturn/findRejectList', param).then(
                res => {
                    if (res.data.success) {
                        this.tableData = res.data.data.dataList
                        this.status = 1
                    } else {
                        this.msgCfg.show = true
                        this.msgCfg.content = res.data.errMsg
                    }
                }
            )
        },
        //获取待退收列表数据
        getWaitReceiveTableData(param) {
            this.$http.post(__URL.sale + 'salesReturn/findWaitReceiveList', param).then(
                    res => {
                if (res.data.success) {
                this.tableData = res.data.data.dataList
                this.status = 1
            } else {
                this.msgCfg.show = true
                this.msgCfg.content = res.data.errMsg
            }
        }
        )
        },
        //获取已退收列表数据
        getReceiveDoneTableData(param) {
            this.$http.post(__URL.sale + 'salesReturn/findReceiveDoneList', param).then(
                    res => {
                if (res.data.success) {
                this.tableData = res.data.data.dataList
                this.status = 1
            } else {
                this.msgCfg.show = true
                this.msgCfg.content = res.data.errMsg
            }
        }
        )
        },
        //新增
        addNew(){
            this.isEdit =  true
            this.salesOutConfig.show = true
        },
        //预览
        preInfo() {
            this.isEdit =  false
        },
        refresh(){
            this.tableData=[]
            this.$broadcast('_RESETLIST')
        },
        clearTable(uid,obj){
            this.tableData = []
        }
    },
    watch:{
        chooseArr:{
            handler:function(val,oldval){
                if(this.haveAllCheck()){
                    this.all = true
                }else{
                    this.all = false
                }
            },
            deep:true
        }
    },
    computed: {
        tableCfg() {
            return cfg.tableCfg
        },
    }
}
</script>
<template>
    <container>
        <div class="body_item">
            <div class="left_item">
                <new-app :config='leftItemCfg' @tab='clearTable' @cb='getFilter'></new-app>
            </div>
            <div class="right_item">
                <div class="item_head btn-ic">
                </div>

                <div class="item_body">
                    <vtable :config='tableCfg' :data='tableData' @link='href'>
                    </vtable>
                </div>
            </div>
        </div>
    </container>
    <!-- 销售退货 -->
    <!--<inner :config="salesOutConfig">-->
        <!--<ireturn  :show.sync ="salesOutConfig.show" @refresh="refresh"></ireturn>-->
    <!--</inner>-->
    <!--预览-->
    <inner :config="detailConfig">
        <rnotice :show.sync="detailConfig.show" :isedit="isEdit" :status="status" :returndata="returnData" :returnheader="returnHeader" @refresh="refresh"></rnotice>
    </inner>
</template>
