<script>



import cfg from './cfg.js'
import info from './infoAndEdit'

export default {
    components: {
        info
    },
    ready() {
    },
    data() {
        return {
            leftItemCfg: cfg.leftItemCfg,
            listObj: cfg.listParam,
            tableData: [],
            orderCfg:{
                show:false,
                title:'销售单变更申请单'
            },
            warnCfg:{
                show:false,
                type:'success',
                content:''
            },
            actId:'',
            isAdd:false,
        }
    },
    methods: {
        getList(param,subParam) {
            if(subParam && subParam.customerCode){
                param.customerCode = subParam.customerCode
            }
            let url = 'salesOrderChange/findUnauditList';
            switch(this.leftItemCfg.tabCfg.select){
                case 'reject':
                    url = 'salesOrderChange/findRejectList';
                    break;
                case 'changeProcess':
                    url = 'salesOrderChange/findChangeProcessList';
                    break;
                case 'changeDone':
                    url = 'salesOrderChange/findChangeDoneList';
                    break;
            }
            this.$http.post(__URL.sale + url,param).then(
                res=>{
                    if(res.data.success){
                        this.tableData = res.data.data.dataList
                    }
                }
            )
        },
        /* 数据请求 */
        openInfo(item){
            this.actId = item.docNo
            this.isAdd = false
            this.orderCfg.show = true
            this.orderCfg.title = '销售单变更申请单'
        },
        refresh(type,tips){
            this.orderCfg.show = false
            this.tableData = []
            this.$broadcast('_RESETLIST');
            if(type){
                this.setWarningSuccess(type,tips)
            }
        },
        //设置提示信息
        setWarningSuccess(type,data){
            this.warnCfg.show = true
            this.warnCfg.content = data
            this.warnCfg.type = type
        },
        clearTable(uid,obj){
            this.tableData = []
        }
    },
    computed: {
        tableCfg() {
            return cfg.tableCfg
        },
        tabNum(){
            return cfg.leftItemCfg.tabCfg.select
        }
    }
}
</script>
<template>
    <container>
        <div class="body_item">
            <div class="left_item">
                <new-app :config='leftItemCfg' @tab='clearTable' @cb='getList'></new-app>
            </div>
            <div class="right_item">
                <div class="item_head btn-ic">

                </div>
                <div class="item_body">
                    <vtable  :config='tableCfg' :data='tableData' @link="openInfo"></vtable>
                </div>
            </div>
        </div>
        <inner :config="orderCfg">
            <info @refresh="refresh"  :id="actId" :tab='tabNum'></info>
        </inner>
        <!--状态消息提示-->
        <warning :config="warnCfg"></warning>
    </container>
</template>
