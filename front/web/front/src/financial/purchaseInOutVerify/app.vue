<script>



import cfg from './cfg.js'
import info from './infoAndEdit.vue'
import pay from './cashierPay.vue'

export default {
    components: {
        info,
        pay
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
             payCfg:{
                show:false,
                title:'付款单详情'
            },
            isBack:false,
             returnCfg:{
                show:false,
                title:'退款单详情'
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
                msg:'确定撤销提交该数据'
            },
            warnCfg:{
                show:false,
                type:'success',
                content:''
            },
            actItem:'',
            actId:'',
            isAdd:false,
            showTable:false,
            checkData:[],
            //区分进核销界面时，是待核销，还是待审核等
            pageType:'',
            revokeCb :true,
        }
    },
    methods: {
        getList(param,subParam) {
            this.checkData = [];
            this.tableData = [];

            let url = '';
            if(subParam && subParam.supplierCode){
                param.supplierCode = subParam.supplierCode
                url = 'verify/payable/wait/cashier/list';
            }
            switch(this.leftItemCfg.tabCfg.select){
                case 'wait':
                    url = 'verify/payable/wait/list';
                    break;
                case 'no':
                    url = 'verify/payable/unaudit/list';
                    break;
                case 'yes':
                url = 'verify/payable/audit/list';
                break;
            }
            if(url){
                this.$http.post(__URL.financial + url,param).then(
                    res=>{
                        if(res.data.success){
                            this.tableData = res.data.data.dataList
                        }
                    }
                )
            }
        },
        // 打开待核销详情界面
        openInfo(item){
            this.actId = item.cashierDocNo
            this.isEdit = false
            this.isAdd = false
            if(item.cashierDocType == '3'){
                this.isBack = true
            }
            this.payCfg.show = true
        },
        //待核销的核销
        verify(type,item){
            this.pageType = 'draft'
            this.actItem = [item]
            this.isAdd = true
            this.isEdit = false
            this.orderCfg.show = true
        },
        //核销多个
        verifyAll(){
            this.pageType = 'draft'
            if(this.checkData.length < 1 ){
                this.verifyAllCfg.show = true
                this.verifyAllCfg.msg = '请至少选择一条数据'
            }else{
                this.actItem = this.checkData
                this.isAdd = true
                this.orderCfg.show = true
            }
        },
         //打开待处理，待审核，已审核详情界面
        openInfoOthers(item){
            this.pageType = 'others'
            this.actItem = [item]
            this.isAdd = false
            this.isEdit = false
            this.orderCfg.show = true
        },
        //编辑待处理
        editOpt(type,item){
            this.pageType = 'others'
            if(type == 'edit'){
                this.actItem = [item]
                this.isAdd = false
                this.isEdit = true
                this.orderCfg.show = true
            }
            if(type == 'delete'){
                this.delCfg.show = true
                this.actItem = item
            }

            if(type == 'push'){
                this.sendData('verify/payable/submit/','提交审核成功',item.docNo )
            }
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
        giveUpPush(type,item){
            this.actItem = item
            this.giveUpCfg.show = true
        },
        doGiveUp(type,item){
            if (this.revokeCb == false)return
            this.revokeCb = false
             this.$http.get(__URL.financial + 'verify/payable/repeal/'+item.docNo).then(
                res=>{
                    if(res.data.success){
                        this.refresh('success','撤销成功')
                    }else{
                         this.setWarningSuccess('failure','撤销提交审核失败')
                    }
                    this.revokeCb= true;
                }
             )
        },

        doDel(type,item){
            if (this.revokeCb == false)return
            this.revokeCb = false
            this.$http.get(__URL.financial + 'verify/payable/delete/'+this.actItem.docNo).then(
                res=>{
                    if(res.data.success){
                        this.refresh('success','删除成功')
                    }else{
                        this.setWarningSuccess('failure',res.data.errMsg)
                    }
                    this.revokeCb = true;
                }
            )
        },
        refreshOnly(){
            this.$broadcast('_RESETLIST');
        },
        //设置提示信息
        setWarningSuccess(type,data){
            this.warnCfg.show = true
            this.warnCfg.content = data
            this.warnCfg.type = type
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
        },
        tableCfg3(){
            return cfg.tableCfg3
        },
        tableCfg4(){
            return cfg.tableCfg4
        }
    },
    watch:{
        leftItemCfg:{
            handler(val,oldval){
                if(val.tabCfg.select == 'waitVerify'){
                    this.showTable = 1
                    this.tableData = []
                    this.checkData = []
                }
                if(val.tabCfg.select == 'wait'){
                    this.showTable = 2
                    this.tableData = []
                }
                if(val.tabCfg.select == 'no'){
                    this.showTable = 3
                    this.tableData = []
                }
                if(val.tabCfg.select == 'yes'){
                    this.showTable = 4
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
                    <a v-if="leftItemCfg.tabCfg.select == 'waitVerify'" href="javascript:;" @click="verifyAll">
                        <i class='icon-cancel__batch'></i>批量核销
                    </a>
                </div>
                <div v-if="showTable == 1" class="item_body">
                    <vtable :checkbox="checkData"  :config='tableCfg' :data='tableData' @op="verify" @link="openInfo"></vtable>
                </div>
                <div v-if="showTable == 2" class="item_body">
                    <vtable  :config='tableCfg2' @op="editOpt" :data='tableData' @link="openInfoOthers"></vtable>
                </div>
                <div v-if="showTable == 3" class="item_body">
                    <vtable  :config='tableCfg3' @op="doGiveUp" :data='tableData' @link="openInfoOthers"></vtable>
                </div>
                <div v-if="showTable == 4" class="item_body">
                    <vtable  :config='tableCfg4'  :data='tableData' @link="openInfoOthers"></vtable>
                </div>
            </div>
        </div>
        <!--审核内页-->
        <inner :config="orderCfg">
            <info :show="orderCfg" @refresh="refresh" @refreshonly='refreshOnly' :item-arr="actItem" :type="pageType" :add="isAdd" :edit="isEdit"></info>
        </inner>
        <!--收款单详情-->
        <inner :config="payCfg">
            <pay :show="payCfg" :id="actId" :back="isBack"></pay>
        </inner>

        <!--批量核销提示-->
        <alert :config="verifyAllCfg"></alert>
        <!--核销提示-->
        <alert :config="giveUpCfg" @cb="doGiveUp"></alert>
        <!--删除提示-->
        <alert :config="delCfg" @cb="doDel"></alert>
        <!--状态消息提示-->
        <warning :config="warnCfg"></warning>
    </container>
</template>
