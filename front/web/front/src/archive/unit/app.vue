<script>



import cfg from './cfg.js'

export default {
    data() {
        return {
            leftItemCfg: cfg.leftItemCfg,
            listObj: cfg.listCfg,
            unitModalCfg: cfg.unitModalCfg,
            tableData: [],
            tipsCfg:{
                show:false,
                content:'操作成功',
                type:'success'
            },
            confirmCfg:{
                show:false,
                msg:'',
                subMsg:'',
                type:'success',
                quite:false
            },
            unitCfg:{},
            repeatSubmit: false
        }
    },
    methods: {
        reset() {
            this.$broadcast('_RESETLIST')
            this.tableData = []
        },
        operate(type, item) {
            if(type == "delete"){
                this.confirmCfg.show = true;
                this.confirmCfg.msg = '确认要删除当前计量单位吗?';
                this.unitModalCfg.unitCode = item.unitCode;
            } else if(type == "modify"){
                this.unitModalCfg.header ='修改计量单位';
                this.$http.get(__URL.arc+'unit/detail/'+item.unitCode).then(
                    (res) => {
                        this.unitCfg = res.data.data;
                        this.unitModalCfg.show = true;
                    }
                );
            }
        },
        /* table数据请求 */
        getList(item) {
            this.$http.post(__URL.arc+'unit/list/'+item.unitCode).then(
                    (res) => {
                         this.tableData=res.data.data.dataList;
                    }
            )
        },
        //新增按钮事件
        addUnitDialog(){
            this.unitCfg={};
            this.unitModalCfg.show = true;
            this.unitModalCfg.header ='新增计量单位';
        },
        //保存按钮事件
        doSaveUnit(){
            if(this.repeatSubmit)return;
            this.repeatSubmit = true;
            if(undefined != this.unitCfg.unitCode && this.unitCfg.unitCode != ''){
                this.$http.post(__URL.arc+'unit/update',this.unitCfg).then(
                        (res) => {
                            this.msgTips(res);
                        }
                )
            }else{
                this.$http.post(__URL.arc+'unit/insert',this.unitCfg).then(
                        (res) => {

                            this.msgTips(res);
                        }
                )
            }
        },
        //删除结算方式
        deleteUnit(){
            if(this.repeatSubmit)return;
            this.repeatSubmit = true;
            this.$http.get(__URL.arc+'unit/delete/'+this.unitModalCfg.unitCode).then(
                    (res) => {
                         this.msgTips(res);
                    }
            );
        },
        //关闭新增页面
        doCloseUnit(text){
            this.unitModalCfg.show=false;
            this.refresh(text);
        },
        msgTips(res){
            if(res.data.success){
                this.tipsCfg.type = 'success';
                this.unitModalCfg.show=false;
                this.refresh(res.data.data);
            }else{
                this.tipsCfg.type = 'failure';
                this.refresh(res.data.errMsg);
            }
        },
        //刷新外页
        refresh(text){
            if(text){
                this.repeatSubmit = false;
                this.tipsCfg.content=text;
                this.tipsCfg.show=true;
                this.reset();
            }
            this.$broadcast('_RESETLIST');
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
            return cfg.tableCfg
        }
    }
}


</script>
<template>
    <container>
        <div class="body_item">
            <div class="left_item">
                <new-app :config='leftItemCfg' @cb='getList' @tab='clearTable' @add='addUnitDialog'></new-app>
            </div>
            <div class="right_item">
                <div class="item_head btn-ic"></div>
                <div class="item_body">
                    <vtable :radio.sync='radioObj' :config='tableCfg' :data='tableData' @op='operate'>
                    </vtable>
                </div>
            </div>
        </div>
    </container>

    <alert :config="confirmCfg" @cb="deleteUnit"></alert>
    <warning :config="tipsCfg"></warning>

    <!-- 新增弹框系列 -->
    <modal :config.sync='unitModalCfg' @sure='doSaveUnit' @close='doCloseUnit'>
        <div class='form-group wd-100'>
            <label><span class="must-point">*</span>计量单位:</label>
            <input type='text' maxlength="20" v-model='unitCfg.unitName' placeholder='请输入计量单位'>
        </div>
        <div class='form-group wd-100'>
            <label>简称单位:</label>
            <input type='text' maxlength="20" v-model='unitCfg.unitShortName' placeholder='请输入简称单位'>
        </div>
    </modal>
</template>
