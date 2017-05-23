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
                title:'销售订单'
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
            let url = 'salesOrder/findWaitingAuditList';
            switch(this.leftItemCfg.tabCfg.select){
                case 'yes':
                    url = 'salesOrder/findAuditList';
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
        },
        addOrder(){
            this.actId = ''
            this.isAdd = true
            this.orderCfg.show = true
        },
        refresh(type,tips){
            this.orderCfg.show = false
            this.tableData = []
            this.$broadcast('_RESETLIST');
            this.setWarningSuccess(type,tips)
        },
        //设置提示信息
        setWarningSuccess(type,data){
            this.warnCfg.show = true
            this.warnCfg.content = data
            this.warnCfg.type = type
        },
         refresh(type,tips){
            this.orderCfg.show = false
            this.tableData = []
            this.$broadcast('_RESETLIST');
            this.setWarningSuccess(type,tips)
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
    }
}
</script>
<template>
    <container>
        <div class="body_item">
            <div class="left_item">
                <new-app :config='leftItemCfg' @tab='clearTable' @add="addOrder" @cb='getList'></new-app>
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
            <info @refresh="refresh" :show="orderCfg" :id="actId" :add="isAdd"></info>
        </inner>
        <!--状态消息提示-->
        <warning @refresh="refresh" :config="warnCfg"></warning>
    </container>
</template>
