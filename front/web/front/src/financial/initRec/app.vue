<script>



    import initrec from './initRec'
    import cfg from './cfg.js'

    export default {
        components: {
            initrec,
        },
        data() {
            return {
                leftItemCfg: cfg.leftItemCfg,
                listObj: cfg.listParam,
                tableData: [],
                orderCfg: {
                    show: false,
                    title: '期初应收单'
                },
                actId: '',
                isAdd: false,
                isEdit: false,
                revokeCb:true,
                wCfg: {
                    show: false,
                    content: '',
                    type: 'warning'
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

            //新增按钮事件
            addNew(){
                this.actId = '';
                this.isAdd = true;
                this.isEdit = false;
                this.orderCfg.show = true;
            },

            //关闭新增页面
            closeNew(type, tips){
                this.orderCfg.show = false;
                this.isEdit = false;
                this.refresh(type, tips)
            },

            setWarningSuccess(type, tips){
                this.wCfg.show = true
                this.wCfg.content = tips
                this.wCfg.type = type
            },

            refresh(type, tips){
                this.setWarningSuccess(type, tips)
                this.tableData = []
                this.$broadcast('_RESETLIST');
            },

            refreshOnly(){
                this.$broadcast('_RESETLIST');
            },

            operateData(url, param, txt) {
                if(this.revokeCb==false)return
                this.revokeCb=false
                this.$http.get(url + param).then(
                    (res) => {
                        if (res.data.success) {
                            this.refresh('success', txt)
                        } else {
                            this.setWarningSuccess('failure', res.data.errMsg)
                        }
                        this.revokeCb=true
                    }
                )
            },

            operate(type, item) {
                console.log(type);
                this.actId = item.docNo;
                if (type == 'modify') {
                    this.actId = item.docNo;
                    this.isAdd = false;
                    this.isEdit = true;
                    this.orderCfg.show = true;
                } else if (type == 'delete') {
                    this.delCfg.show = true;
                } else if (type == 'submit') {
                    this.doSubmit();
                } else if (type == 'repeal') {
                    this.doRepeal();
                }
            },

            doDel(){
                this.operateData(__URL.financial + 'init/receivable/delete/', this.actId, '删除成功！')
            },

            doSubmit(){
                this.operateData(__URL.financial + 'init/receivable/submit/', this.actId, '提交审核成功！')
            },

            doRepeal(){
                this.operateData(__URL.financial + 'init/receivable/repeal/', this.actId, '撤销提交审核成功，等待主管同意！')
            },

            href(item, type) {
                this.actId = item.docNo;
                this.isAdd = false;
                this.isEdit = false;
                this.orderCfg.show = true;
            },

            getFilter(item, obj) {
                if (obj && obj.customerCode) {
                    item.customerCode = obj.customerCode
                }
                this.getList(item)
            },
            /* 数据请求 */
            getList(obj) {
                console.log(obj);
                this.$http.post(__URL.financial + 'init/receivable/list', obj).then(
                    (res) => {
                        this.tableData = res.data.data.dataList
                    }
                )
            },
            clearTable(uid,obj){
                this.tableData = []
            }
        },

        computed: {
            tableCfg() {
                this.tableData = [];
                var myCfg = cfg.waitSubmitTableCfg;
                switch (cfg.leftItemCfg.tabCfg.select) {
                    case 'tab1':
                        myCfg = cfg.waitSubmitTableCfg;
                        break;
                    case 'tab2':
                        myCfg = cfg.unauditTableCfg;
                        break;
                    case 'tab3':
                        myCfg = cfg.auditTableCfg;
                        break;
                }
                return myCfg;
            },
        }
    }
</script>
<template>
    <container>
        <div class="body_item">
            <div class="left_item">
                <new-app :config='leftItemCfg' @tab='clearTable' @cb='getFilter' @add='addNew'></new-app>
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
    <inner :config='orderCfg'>
        <initrec :show="orderCfg" :id="actId" :add="isAdd" :edit="isEdit"
                 @refresh='closeNew' @refreshonly='refreshOnly'></initrec>
    </inner>
    <warning :config="wCfg"></warning>

    <alert :config="delCfg" @cb="doDel"></alert>

</template>
