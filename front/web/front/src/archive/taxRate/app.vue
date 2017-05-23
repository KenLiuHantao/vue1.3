<script>
import cfg from './cfg.js'

export default {

    data() {
        return {
            leftItemCfg: cfg.leftItemCfg,
            modalConfig: {
                show: false,
                width: '410px',
                height: 'auto',
                header: '新增税率',
                btn: [{
                    name: '取消',
                    emit: 'close',
                }, {
                    name: '确定',
                    emit: 'sure',
                }]
            },
            warnConfig: {
                show: false,
                type: 'success',
                content: '操作成功'
            },
            alertConfig: {
                show: false,
                type: 'warning',
                msg: '是否删除当前数据?',
                subMsg: ''
            },
            listObj: cfg.listParam,
            tableData: [],
            taxRateData: {},
            edit:false
        }
    },
    methods: {
        /* 重置对象 */
        initListObj(obj) {
            let init = {
                'pageIndex': 0,
                'pageSize': 0
            }
            return init
        },
        // table返回的操作参数
        operate(type, item) {
            this.taxRateData = item;
            if('edit' == type){
                this.openUpdateModal();
            } else if('delete' == type){
                this.alertConfig.show = true;
            }
        },
        href(item, type) {

        },
        getFilter(item, obj) {
            this.getList(item)
        },
        /* 数据请求 */
        getList(obj) {
            var url = __URL.arc + 'taxrate/list';
            this.$http.post(url, obj).then((res) => {
                this.tableData = res.data.data.dataList
            });
        },
        refresh() {
            this.modalConfig.show = false;
            this.$broadcast('_RESETLIST');
            this.tableData = [];
        },
        openAddModal() {
            this.modalConfig.header = '新增税率';
            this.modalConfig.show = true;
            this.edit = false
            this.taxRateData = {
                taxTypeCode: '',
                taxTypeName: '',
            }
        },
        openUpdateModal() {
            this.modalConfig.header = '修改税率';
            this.modalConfig.show = true;
            this.edit = true
        },
        doSave() {
            console.log();
            let url = __URL.arc + 'taxrate/insert';
            if(this.edit) {
                url = __URL.arc + 'taxrate/update';
            }
            this.$http.post(url, this.taxRateData).then((res) => {
                if(res.data.success) {
                    this.warnConfig.content = '保存成功';
                    this.warnConfig.type = 'success';
                    this.warnConfig.show = true;
                } else {
                    this.warnConfig.content = res.data.errMsg;
                    this.warnConfig.type = 'failure';
                    this.warnConfig.show = true;
                }

                this.refresh();
            });
        },
        doDelete() {
            this.alertConfig.show = false
            this.$http.post(__URL.arc + 'taxrate/delete', this.taxRateData).then((res) => {
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
            return cfg.taxRateTableCfg;
        },
        tableParams() {
            let param = {
                'entCode': '',
                'params': {
                    'pageIndex': 0,
                    'pageSize': 0
                },
                'userCode': ''
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
                <new-app :config='leftItemCfg' @tab='clearTable' @add='openAddModal' @cb='getFilter'></new-app>
            </div>
            <div class="right_item">
                <div class="item_head btn-ic">

                </div>
                <div class="item_body">
                    <vtable :checkbox.sync='checkedData' :config='tableCfg' :data='tableData' @op='operate' @link='href'></vtable>
                </div>
            </div>
        </div>
    </container>

    <!-- 弹框系列 -->
    <modal :config.sync='modalConfig' @sure='doSave' @close='modalConfig.show = false;'>
        <div class="pd-10">
            <div class='form-group'>
                <label>税率(%):</label>
                <div class="s-input ic2">
                <input-number :code.sync="taxRateData.taxRate"   placeholder="请输入税率" ></input-number>
                </div>
            </div>
            <div class='form-group'>
                <label>税种:</label>
                <div class="s-input ic2">
                <select v-model="taxRateData.taxTypeCode">
                    <option value="001">增值税</option>
                </select>
                </div>
            </div>
        </div>
    </modal>

    <alert :config="alertConfig" @cb="doDelete"></alert>

    <warning :config="warnConfig"></warning>
</template>
<style lang='less' scoped>
    @import '../../../../../public/css/variable.less';
    .pd-10 {
        padding: 10px;
    }
</style>