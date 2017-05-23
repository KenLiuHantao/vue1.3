<script>
    import newast from './newAsset.vue'
    import infoed from './infoEdit.vue'
    import cfg from './cfg.js'

    export default {
        components: {
            newast,
            infoed,
            cfg
        },
        ready() {

        },
        data() {
            return {
                //左列表配置
                leftItemCfg: cfg.leftItemCfg,
                tableCfg: cfg.tableCfg,
                tableData: [],
                paramData:{
                    assetCode: '',
                    recordVersion: 0
                },
                assetCode:'',
                recordVersion: 0,
                isEdit:false,
                //0 hr，1 财务
                status:0,
                //新增固定资产 内页配置
                newConfig:{
                    show: false,
                    width: '100%',
                    height: '100%',
                    title: '新增固定资产',
                },
                //资产详情/编辑 内页配置
                infoConfig: {
                    show: false,
                    width: '100%',
                    height: '100%',
                    title: '固定资产档案',
                },
                alertConfig: {
                    show: false,
                    type: 'warning',
                    msg: '是否删除当前数据?',
                    subMsg: ''
                },
                warnConfig: {
                    show: false,
                    type: 'success',
                    content: '操作成功'
                },
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
            //固定资产详情页
            href(item) {
                this.isEdit = false
                this.infoConfig.show = true
                this.assetCode = item.assetCode
            },
            getFilter(item) {
                console.log(item)
                this.$http.post(__URL.hr + 'asset/list', item).then(
                    res => {
                        if (res.data.success) {
                            this.tableData = res.data.data.dataList
                        } else {
                            this.warnConfig.show = true
                            this.warnConfig.content = res.data.errMsg
                        }
                    }
                )
            },
            //新增
            addNew(){
                this.newConfig.show = true
            },
            operate(type, item) {
                this.assetCode = item.assetCode;
                this.recordVersion = item.recordVersion
                if('edit' == type){
                    this.isEdit = true
                    this.infoConfig.show = true;
                } else if('delete' == type){
                    this.alertConfig.show = true;
                }
            },
            refresh(text){
                if(text){
                    this.warnConfig.content = text;
                    this.warnConfig.type = 'success';
                }
                this.tableData=[]
                this.$broadcast('_RESETLIST')
            },
            doDelete(){
                this.paramData.assetCode = this.assetCode
                this.paramData.recordVersion = this.recordVersion
                this.$http.post(__URL.hr + 'asset/delete', this.paramData).then((res) => {
                    if(res.data.success) {
                        this.warnConfig.content = '删除成功';
                        this.warnConfig.type = 'success';
                        this.warnConfig.show = true;
                    } else {
                        this.warnConfig.content = res.data.errMsg;
                        this.warnConfig.type = 'failure';
                        this.warnConfig.show = true;
                    }
                    this.refresh();
                });
                this.alertConfig.show = false
            }
        },
    }
</script>
<template>
    <container>
        <div class="body_item">
            <div class="left_item">
                <new-app :config='leftItemCfg' @cb='getFilter' @add="addNew"></new-app>
            </div>
            <div class="right_item">
                <div class="item_head btn-ic">
                </div>
                <div class="item_body">
                    <vtable :config='tableCfg' :data='tableData' @op='operate' @link='href'>
                    </vtable>
                </div>
            </div>
        </div>
    </container>
    <!-- 新增内页 -->
    <inner :config="newConfig">
        <newast :show.sync="newConfig.show" @refresh></newast>
    </inner>
    <!-- 预览/编辑内页 -->
    <inner :config="infoConfig">
        <infoed :show.sync="infoConfig.show" :is-edit="isEdit" :status="status" :code="assetCode"></infoed>
    </inner>
    <!-- 删除提示 -->
    <alert :config="alertConfig" @cb="doDelete"></alert>
    <warning :config="warnConfig"></warning>
</template>