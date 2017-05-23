<script>



import cfg from './cfg.js'
import newbalance from './newInitBalance.vue'
import editbalance from './editInitBalance.vue'
import auditbalance from './auditInitBalance.vue'
export default {
    components: {
        newbalance,
        editbalance,
        auditbalance,
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
                height: '250px',
                header: '选择期初余额类型'
            },
            newConfig:{
                show: false,
                width: '100%',
                height: '100%',
                title:'现金期初余额'
            },
            editConfig:{
                show: false,
                width: '100%',
                height: '100%',
                title:'现金期初余额'
            },
            auditConfig:{
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
            delCfg: {
                show: false,
                type: 'warning',
                msg: '确定删除该条记录'
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
            if(type =='modify'){//修改
                this.openEdit(item.docNo)
            } else if ('delete' == type) {//删除
                this.delCfg.show = true;
                this.docNo= item.docNo;
            } else if ("submit" == type) {//提交
                this.$http.post(__URL.financial + 'init/balance/submit', {'docNo':item.docNo,"recordVersion":item.recordVersion}).then(
                    (res) => {
                        this.showMsg('warning',res.data.errMsg);
                        if(res.data.success){
                            this.showMsg('success','提交成功');
                            this.refresh();
                        }

                    }
                )
            }else if ("cancel" == type) {//撤销
                this.$http.post(__URL.financial + 'init/balance/applyRevoke', {'docNo':item.docNo,"recordVersion":item.recordVersion}).then(
                    (res) => {
                        this.showMsg('warning',res.data.errMsg);
                        if(res.data.success){
                            this.showMsg('success','申请撤销成功');
                            this.refresh();
                        }
                    }
                )
            }
        },
        doDel(){
            this.$http.get(__URL.financial + 'init/balance/delete/' + this.docNo).then(
                (res) => {
                    this.showMsg('warning',res.data.errMsg);
                    if(res.data.success){
                        this.showMsg('success','删除成功');
                        this.refresh();
                    }
                }
            );
        },
        href(item, type) {
            if(type == 'docNo'){
                if(cfg.leftItemCfg.tabCfg.select == 'tab1') {
                    this.openEdit(item.docNo);
                }else {
                    this.openAudit(item.docNo);
                }
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
        openEdit(docNo){
            this.editConfig.show=true;
            this.docNo=docNo;
            this.editConfig.title= (this.balanceCategoryCode=="001"?"现金期初余额":"银行存款期初余额");
        },
        closeEdit(){
            this.editConfig.show=false;
            this.refresh()
        },
        openAudit(docNo){
            this.auditConfig.show=true;
            this.docNo=docNo;
            this.auditConfig.title= (this.balanceCategoryCode=="001"?"现金期初余额":"银行存款期初余额");
        },
        closeAudit(){
            this.auditConfig.show=false;
            this.refresh()
        },
        openEditWithDocNo(item){
            this.docNo=item;
            this.editConfig.show=true;
            this.refresh();
        },
        openAuditWithDocNo(item){
            this.docNo=item;
            this.auditConfig.show=true;
            this.refresh();
        },
        refresh() {
            this.$broadcast('_RESETLIST');
            this.tableData = [];
        },
        openAdd() {
            this.modalConfig.header = '选择期初余额类型';
            this.modalConfig.show = true;

        },
        jumpAdd(obj){
            this.docNo="";
            this.newConfig.show=true;
            this.newConfig.title= obj=="001"?"现金期初余额":"银行存款期初余额";
            this.modalConfig.show = false;
            this.balanceCategoryCode=obj;
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
                return this.balanceCategoryCode=="" || this.balanceCategoryCode=="001"? cfg.cashTableCfg1:cfg.bankTableCfg1;
            }else if(cfg.leftItemCfg.tabCfg.select == 'tab2'){
                return this.balanceCategoryCode=="" || this.balanceCategoryCode=="001"? cfg.cashTableCfg2:cfg.bankTableCfg2;
            }else{
                return this.balanceCategoryCode=="" || this.balanceCategoryCode=="001"? cfg.cashTableCfg3:cfg.bankTableCfg3;
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
                <new-app :config='leftItemCfg' @tab='clearTable' @cb='getFilter' @add="openAdd" @reference='openRef'></new-app>
            </div>
            <div class="right_item">
                <div class="item_head btn-ic">

                </div>
                <div class="item_body">
                    <vtable  :config='tableCfg' :data='tableData'  @link='href' @op="operate">
                    </vtable>
                </div>
            </div>
        </div>
    </container>

    <!--警告-->
    <warning :config="warCfg"></warning>

    <alert :config="delCfg" @cb="doDel"></alert>

    <!-- 弹框系列 -->
    <modal :config.sync='modalConfig' @sure='openDetail' @close='modalConfig.show = false;'>
        <div class="modal-input-wrap">
            <div class='item'>
                <img src="../../../../../public/images/cash.png" alt="现金" @click="jumpAdd('001')"/>
                <div>现金</div>
            </div>
            <div class='item'>
                <img src="../../../../../public/images/bankbalance.png" alt="银行存款" @click="jumpAdd('002')"/>
                <div>银行存款</div>
            </div>
        </div>
    </modal>

    <!-- 详情内页-->
    <inner :config='newConfig'>
        <newbalance  :balancecategorycode="balanceCategoryCode"  :detailconfig="newConfig" @openeditor="openEditWithDocNo"  @openaudit="openAuditWithDocNo"></newbalance>
    </inner>

    <!-- 详情内页-->
    <inner :config='editConfig'>
        <editbalance  :docno="docNo" :balancecategorycode="balanceCategoryCode"  :detailconfig="editConfig" @openaudit="openAuditWithDocNo" @refresh='closeEdit'></editbalance>
    </inner>

    <!-- 详情内页-->
    <inner :config='auditConfig'>
        <auditbalance :docno="docNo" :balancecategorycode="balanceCategoryCode"  :detailconfig="auditConfig"  @refresh='closeAudit'></auditbalance>
    </inner>
</template>

<style lang="less" scoped>
    .modal-input-wrap {
        display: flex;
        justify-content: center;
        align-items: flex-end;
        height: 204px;

        .item {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 113px;
            height: 130px;
            margin-bottom: 30px;
            background-color: #fcfeff;
            border: 1px solid #ebf7fd;
            border-radius: 5px;
            cursor: pointer;

            &:first-of-type {
                margin-right: 40px;
            }

            &:hover,
            &:active {
                border-color: #03a9f4;

                div {
                    color: #03a9f4;
                }
            }

            img {
                display: block;
                width: 80px;
                height: 80px;
            }

            div {
                margin-top: 12px;
                color: #757575;
                font-size: 12px;
            }
        }
    }
</style>
