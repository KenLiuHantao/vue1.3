<script>



import cfg from './cfg.js'

export default {

    ready() {
        document.addEventListener('click', () => {
            this.currentIndex = -1
        })
    },
    data() {
        return {
            leftItemCfg: cfg.leftItemCfg,
            modalConfig: {
                show: false,
                width: '410px',
                height: 'auto',
                header: '新增仓库',
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
            warehouseData: {},
            currentIndex:-1,
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
            this.warehouseData = item;
            switch (type) {
                case 0: // 编辑
                    this.openUpdateModal();
                    break;
                case 1: // 删除
                    this.alertConfig.show = true;
                    break;
                case 2: //启用/停用
                    let isEnable = this.warehouseData.recordStatus == 0;
                    let params = {
                        warehouseCode: this.warehouseData.warehouseCode,
                        recordStatus: isEnable ? 1 : 0,
                        recordVersion: this.warehouseData.recordVersion
                    }
                    this.$http.post(__URL.arc + 'warehouse/update/status', params).then((res) => {
                        if(res.data.success) {
                            this.warnConfig.content = isEnable ? '启用成功' : '停用成功';
                            this.warnConfig.type = 'success';
                            this.warnConfig.show = true;
                        } else {
                            this.warnConfig.content = res.data.errMsg;
                            this.warnConfig.type = 'failure';
                            this.warnConfig.show = true;
                        }

                        this.refresh();
                    });
                    break;
            }
        },
        getFilter(item, obj) {
            this.getList(item)
        },
        /* 数据请求 */
        getList(obj) {
            var url = __URL.arc + 'warehouse/list';
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
            let isInventoryType = cfg.leftItemCfg.tabCfg.select == 'tab1';
            this.modalConfig.header = '新增仓库';
            this.modalConfig.show = true;
            this.warehouseData = {
                warehouseCategoryCode: isInventoryType ? '001' : '002',
                warehouseCategoryName: isInventoryType ? '货品仓库' : '行政仓库',
                warehouseCode: '',
                warehouseName: ''
            }
        },
        openUpdateModal() {
            this.modalConfig.header = '修改仓库';
            this.modalConfig.show = true;
        },
        doSave() {
            let url = __URL.arc + 'warehouse/insert';
            if(this.warehouseData.recordVersion) {
                url = __URL.arc + 'warehouse/update';
            }
            this.$http.post(url, this.warehouseData).then((res) => {
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
            this.$http.post(__URL.arc + 'warehouse/delete?warehouseCode=' + this.warehouseData.warehouseCode).then((res) => {
                this.alertConfig.show = false;
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
        //显示操作按钮
        optionThisLine(val) {
            this.currentIndex = val
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
            var myCfg = cfg.inventoryTableCfg;
            switch(cfg.leftItemCfg.tabCfg.select) {
                case 'tab1':
                    myCfg = cfg.inventoryTableCfg;
                    break;
                case 'tab2':
                    myCfg = cfg.adminTableCfg;
                    break;
            }
            return myCfg;
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
                    <table class="table-wrap">
                        <thead>
                        <tr>
                            <th width="30%">名称</th>
                            <th width="30%">仓库类别</th>
                            <th width="30%">状态</th>
                            <th width="10%">操作</th>
                        </tr>
                        </thead>
                        <tbody v-show="tableData.length">
                        <tr v-for="item in tableData">
                            <td>{{item.warehouseName}} </td>
                            <td>{{item.warehouseCategoryName}}</td>
                            <td>{{item.status}}</td>
                            <td class="option">
                                <div class="option-wrap">
                                    <div class="dot-group" :class="{'active':currentIndex == $index}" @click.stop="optionThisLine($index)">
                                        <span></span><span></span><span></span>
                                    </div>
                                    <div v-show='currentIndex == $index' class="button-group">
                                        <span class="arrow"></span>
                                        <div class="opt success" v-if="item.recordStatus==1" @click="operate(0,item)">编辑</div>
                                        <!--<div class="opt danger" v-if="item.recordStatus==1" @click="operate(1,item)">删除</div>-->
                                        <div class="opt danger" v-if="item.recordStatus==1" @click="operate(2,item)">停用</div>
                                        <div class="opt success" v-if="item.recordStatus==0" @click="operate(2,item)">启用</div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </container>

    <!-- 弹框系列 -->
    <modal :config.sync='modalConfig' @sure='doSave' @close='modalConfig.show = false;'>
            <div class='form-group wd-100'>
                <label>仓库类别:</label>
                <p>{{ warehouseData.warehouseCategoryName }}</p>
            </div>
            <div class='form-group wd-100'>
                <label><span class="must-point">*</span>仓库名称:</label>
                <div class="s-input">
                <input type='text' v-model='warehouseData.warehouseName' placeholder='请输入仓库名称'>
                </div>
            </div>
    </modal>

    <alert :config="alertConfig" @cb="doDelete"></alert>

    <warning :config="warnConfig"></warning>
</template>
<style lang='less' scoped>
    @import '../../../../../public/css/variable.less';
    .table-wrap{
        width: 100%;
        font-size: 14px;
        color: @gray;
        text-align: center;
    thead tr th {
        padding: 18px 7px;
        position: relative;
        font-weight: normal;
        color: @gray-sub;
        border-bottom: 1px solid @border-color;
    }
    tbody tr {
    &:nth-of-type(2n-1) {
         background-color: #FAFAFA;
     }
    &:hover {
         background-color: #EBF7FD;
     }
    td{
        position: relative;
        border-bottom: 1px solid @border-color;
        font-size: 12px;
        padding: 14px 7px;
    }
    }
    a{
        color: @link-color;
        width: 100%;
        display: inline-block;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }
    }

    .option-wrap {
        position: relative;
        text-align: center;
    .dot-group {
        display: flex;
        height: 20px;
        align-items: center;
        flex-direction: row;
        justify-content: center;
        cursor: pointer;
    span {
        display: flex;
        width: 4px;
        height: 4px;
        margin-right: 3px;
        border-radius: 50%;
        background-color: #ADADAD;
    }

    &.active span{
         background-color: @link-color;
     }
    }
    .button-group {
        position: absolute;
        display: flex;
        flex-direction: column;
        border: 1px solid @border-color;
        border-radius: 2px;
        background-color: white;
        width: 55px;
        left: 50%;
        top: 20px;
        transform: translateX(-50%);
        z-index: 99;
    .arrow {
        width: 6px;
        height: 6px;
        background-color: white;
        border: 1px solid @border-color;
        border-bottom: none;
        border-left: none;
        left: 50%;
        top: -1px;
        position: absolute;
        transform: translateY(-50%) translateX(-50%) rotate(-45deg);
    }
    div.opt {
        padding: 5px;
    }
    div.opt:hover {
        color: #008af5;
        cursor: pointer;
    }
    div:nth-of-type(1) {
        padding-top: 10px;
    }
    div:last-child {
        margin-bottom: 0;
        padding-bottom: 10px;
    }
    .success{
        color: #008AF5;
    }
    .danger{
        color: #FF0700;
    }
    }
    }
</style>