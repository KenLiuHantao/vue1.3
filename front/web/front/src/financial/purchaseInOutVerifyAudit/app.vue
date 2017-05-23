<script>



import cfg from './cfg.js'
import info from './infoAndEdit.vue'

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
                title:'采购付款核销单'
            },
            verifyAllCfg:{
                show:false,
                type:'warning',
                msg:'请选择至少一条记录'
            },
            delCfg:{
                show:false,
                type:'warning',
                msg:'确定删除该条记录'
            },
            giveUpCfg:{
                show:false,
                type:'warning',
                msg:'确定撤销提交审核该数据'
            },
            warnCfg:{
                show:false,
                type:'success',
                content:''
            },
            actItem:'',
            isAdd:false,
            showTable:false,
            checkData:[],
            //区分进核销界面时，是待核销，还是待审核等
            pageType:'',
            revokeCb : true,
        }
    },
    methods: {
        getList(param,subParam) {
            if(subParam && subParam.supplierCode){
                param.supplierCode = subParam.supplierCode
            }
            let url = 'verify/payable/unaudit/list';
            if(this.leftItemCfg.tabCfg.select == 'yes'){
                url = 'verify/payable/audit/list'
            }
            this.$http.post(__URL.financial + url,param).then(
                res=>{
                    if(res.data.success){
                        this.tableData = res.data.data.dataList
                    }
                }
            )
        },
         //打开待处理，待审核，已审核详情界面
        openInfoOthers(item){
            this.pageType = 'others'
            this.actItem = [item]
            this.isAdd = false
            this.isEdit = false
            this.orderCfg.show = true
        },
        didAudit(type,item){
            this.sendData('verify/payable/audit/','审核成功',item.docNo )
        },
        giveUpAudit(type,item){
            this.sendData('verify/payable/unaudit/','弃审成功',item.docNo)
        },
        sendData(url,tips,id){
            if (this.revokeCb == false)return
            this.revokeCb = false
            this.$http.get(__URL.financial + url + id).then(
                res=>{
                    if(res.data.success){
                        this.refresh('success',tips)
                    }else{
                        this.setWarningSuccess('failure',res.data.errMsg)
                    }
                    this.revokeCb = true;
                }
            )
        },
        //设置提示信息
        setWarningSuccess(type,data){
            this.warnCfg.show = true
            this.warnCfg.content = data
            this.warnCfg.type = type
        },
        refreshOnly(){
            this.$broadcast('_RESETLIST');
        },
        refresh(type,tips){
            this.orderCfg.show = false
            this.setWarningSuccess(type,tips)
            this.$broadcast('_RESETLIST');
            this.tableData = []
            this.checkData = []
        },
        clearTable(uid,obj){
            this.tableData = []
        }
    },
    computed: {
        tableCfg() {
            return cfg.tableCfg
        },
        tableCfg2(){
            return cfg.tableCfg2
        }
    },
    watch:{
        leftItemCfg:{
            handler(val,oldval){
                if(val.tabCfg.select == 'no'){
                    this.showTable = 1
                    this.tableData = []
                    this.checkData = []
                }
                if(val.tabCfg.select == 'yes'){
                    this.showTable = 2
                    this.tableData = []
                }
            },
            deep:true
        }
    }
}
</script>
<template>
    <container>
        <div class="body_item">
            <div class="left_item">
                <new-app :config='leftItemCfg' @tab='clearTable'  @cb='getList'></new-app>
            </div>
            <div class="right_item">
                <div class="item_head btn-ic">
                </div>
                <div v-if="showTable == 1" class="item_body">
                    <vtable :checkbox="checkData"  :config='tableCfg' :data='tableData' @op="didAudit" @link="openInfoOthers"></vtable>
                </div>
                <div v-if="showTable == 2" class="item_body">
                    <vtable  :config='tableCfg2' @op="giveUpAudit" :data='tableData' @link="openInfoOthers"></vtable>
                </div>
            </div>
        </div>
        <inner :config="orderCfg">
            <info :show="orderCfg" @refresh="refresh" @refreshonly='refreshOnly' :item-arr="actItem" :type="pageType" :add="isAdd" :edit="isEdit"></info>
        </inner>
        <!--状态消息提示-->
        <warning :config="warnCfg"></warning>
    </container>
</template>
