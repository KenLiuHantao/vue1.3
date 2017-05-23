<script>

import rnotice from './returnNotice.vue'
import cfg from './cfg.js'

export default {
    components: {
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
            isEdit:false,
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
            title: '退货申请单',
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
                    } else {
                        this.msgCfg.show = true
                        this.msgCfg.content = res.data.errMsg
                    }
                }
            )
        },
        getFilter(item, obj) {
            if (obj && obj.yearWeek != undefined) {
                item.yearWeek = obj.yearWeek;
            }
            if (obj && obj.customerCode != undefined) {
                item.customerCode = obj.customerCode;
            }
            switch (cfg.leftItemCfg.tabCfg.select) {
                case 'tab1':
                    this.getWaitauditTableData(item);
                    break;
                case 'tab2':
                    this.getAuditTableData(item);
                    break;
            }
        },
        //获取待审核列表数据
        getWaitauditTableData(param) {
            this.$http.post(__URL.sale + 'salesReturn/findWaitAuditList', param).then(
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
        //获取已审核列表数据
        getAuditTableData(param) {
            this.$http.post(__URL.sale + 'salesReturn/findAuditList', param).then(
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
    <!--预览-->
    <inner :config="detailConfig">
        <rnotice :show.sync="detailConfig.show" :isedit="isEdit" :status="status" :returndata="returnData" :returnheader="returnHeader" @refresh="refresh"></rnotice>
    </inner>
</template>
