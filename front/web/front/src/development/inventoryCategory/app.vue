<script>
    import cfg from './cfg.js'
    import info from './infoAndEdit.vue'
    import rule from './editRule.vue'
    export default {
        components: {
            info,
            rule
        },
        ready() {
            this.choiceTab("001");
            document.addEventListener('click', () => {
                this.current = -2
            })
        },
        data() {
            return {
                index: '-1',
                current: '-2',
                leftItemCfg: cfg.leftItemCfg,
                listObj: cfg.listParam,
                tableData: [],
                inventoryCategorys: [],
                ckdCode: '',
                openCode: '',
                activeTab: "001",
                selCategoryCode: "",
                actItem: '',
                actInfoItem:'',
                isAdd: false,
                isEdit: false,
                isFirst: false,
                isSecond: false,
                infoCfg: {
                    show: false,
                    header: '新增货品一级分类',
                    width: '576px',
                    btn: [{
                        name: '取消',
                        emit: 'quite'
                    }, {
                        name: '保存',
                        emit: 'sure'
                    }]
                },
                // 配置查看详情 modal
                watchInfoCfg: {
                    show: false,
                    header: '货品分类',
                    width: '576px',
                    btn: [{
                        name: '确定',
                        emit: 'sure'
                    }]
                },
                ruleCfg: {
                    show: false,
                    header: '编辑规则定义',
                    width: '400px',
                    btn: [{
                        name: '取消',
                        emit: 'quite'
                    }, {
                        name: '保存',
                        emit: 'sure'
                    }]
                },
                delCfg: {
                    show: false,
                    type: 'warning',
                    msg: '是否删除此行记录'
                },
                warnCfg: {
                    show: false,
                    type: 'success',
                    content: ''
                },
                dataModal: {
                    "code": "",
                    "name": "",
                    "type": "",
                    "industryCategoryCode": "",
                    "remark": "",
                    "recordVersion": 0
                },
                lockRepeatSubmit: false
            }
        },
        methods: {
            operatingItem(code) {//下拉
                this.current = code;
            },
            choiceTab(index){
                this.activeTab = index;
                this.openCode = ''
                this.ckdCode = ''
                this.tableData = []
                this.getInventoryCategory();
            },
            getInventoryCategory(){
                var param = {type: this.activeTab};
                this.$http.post(__URL.development + 'inventory/category/children', param, {emulateJSON: true}).then(
                    (res) => {
                        if (res.data.success) {
                            this.inventoryCategorys = res.data.data
                        } else {
                            this.$warning({'type': 'failure', 'message': res.data.errMsg})
                        }
                    }
                )
            },
            checkThisLine(item){
                this.actItem = item
                this.getList(item)
            },
            //获取列表
            getList(item) {
                this.$http.post(__URL.development + 'inventory/category/rules', {code:item.code},{emulateJSON:true}).then(
                    res => {
                        if (res.data.success) {
                            this.tableData = res.data.data
                        }
                    }
                )
            },
            //详情信息
            openInfo(item){
                this.actItem = item
                this.isAdd = this.isEdit = false
                // this.infoCfg.show = true
                // 打开查看详情 modal
                this.watchInfoCfg.show = true
            },
            //新增
            addFirst(){
                this.actItem = Object.assign({}, this.dataModal)
                this.isAdd = true;
                this.isEdit = false;
                this.isFirst = true;
                this.isSecond = false;
                this.infoCfg.header = '新增货品一级分类';
                this.infoCfg.show = true
            },
            addSecond(code){
                this.dataModal.code = code;
                this.actItem = Object.assign({}, this.dataModal);
                this.isAdd = true;
                this.isEdit = false;
                this.isFirst = false;
                this.isSecond = true;
                this.infoCfg.header = '添加货品二级分类';
                this.infoCfg.show = true
            },
            editFirst(inventoryCategory){
                this.actItem = Object.assign({}, inventoryCategory);
                this.isAdd = false;
                this.isEdit = true;
                this.isFirst = true;
                this.isSecond = false;
                this.infoCfg.header = '编辑货品一级分类';
                this.infoCfg.show = true
            },
            editSecond(inventoryCategory){
                this.actItem = Object.assign({}, inventoryCategory);
                this.isAdd = false;
                this.isEdit = true;
                this.isFirst = false;
                this.isSecond = true;
                this.infoCfg.header = '编辑货品二级分类';
                this.infoCfg.show = true
            },
            //编辑
            edit(item){
                this.actInfoItem = Object.assign({}, item)
                this.ruleCfg.show = true;
            },
            //删除提示框
            del(item){
                this.actInfoItem = item
                this.delCfg.show = true
            },
            //删除数据
            deleteData(){
                this.$http.get(__URL.arc + 'inventory/category/delete/' + this.actItem.inventoryCategoryCode).then(
                    res => {
                        if (res.data.success) {
                            this.setWarningSuccess('success', '删除成功')
                        } else {
                            this.setWarningSuccess('failure', res.data.errMsg)
                        }
                    }
                )
            },
            //设置提示信息
            setWarningSuccess(type, data){
                this.warnCfg.show = true
                this.warnCfg.content = data
                this.warnCfg.type = type
            },
            //弹框取消
            quite(){
                this.ruleCfg.show = false;
                this.infoCfg.show = false;
            },
            sureRule(){
                let item = this.actInfoItem
                let param = {
                    code: item.categoryCode,
                    type: item.type,
                    value: item.value,
                    status: item.recordStatus
                }
                if (!this.lockRepeatSubmit) {
                    this.saveRule(__URL.development + 'inventory/category/saveRule', param);
                }
            },
            //保存数据
            saveRule(url, param){
                if (!this.checkRule(param)) return
                this.lockRepeatSubmit = true
                this.$http.post(url, param, {emulateJSON: true}).then(
                    res => {
                        if (res.data.success) {
                            this.ruleCfg.show = false;
                            this.getList(this.actItem);
                            this.setWarningSuccess('success', '保存成功')
                        } else {
                            this.setWarningSuccess('failure', res.data.errMsg)
                        }
                        this.lockRepeatSubmit = false
                    }
                )
            },
            checkRule(val){
                console.log(val)
                if (val.typeName == '') {
                    this.setWarningSuccess('failure', '规则项目不能为空');
                    return false
                }
                if (val.value == '') {
                    this.setWarningSuccess('failure', '规则定义不能为空');
                    return false
                }
                return true;
            },
            //弹框确认
            sure(){
                let param = this.actItem
                let secondParam = {
                    parentCode: param.code,
                    name: param.name,
                    remark: param.remark
                }
                if (this.isAdd && !this.isEdit) {
                    if (!this.lockRepeatSubmit) {
                        if (this.isFirst) {
                            this.saveData(__URL.development + 'inventory/category/addFirst', param);
                        } else if (this.isSecond) {
                            this.saveData(__URL.development + 'inventory/category/addSecond', secondParam)
                        }
                    }
                } else if (this.isEdit && !this.isAdd) {
                    if (!this.lockRepeatSubmit) {
                        if (this.isFirst) {
                            this.saveData(__URL.development + 'inventory/category/update', param);
                        } else if (this.isSecond) {
                            this.saveData(__URL.development + 'inventory/category/update', param)
                        }
                    }
                } else {
                    this.infoCfg.show = false
                    // 关闭查看详情 modal
                    this.watchInfoCfg.show = false
                }
            },
            //保存数据
            saveData(url, param){
                if (!this.check()) return
                this.lockRepeatSubmit = true
                this.$http.post(url, param, {emulateJSON: true}).then(
                    res => {
                        if (res.data.success) {
                            this.infoCfg.show = false;
                            this.getInventoryCategory();
                            this.$broadcast('_RESETLIST')
                            this.tableData = []
                            this.setWarningSuccess('success', '保存成功')
                        } else {
                            this.setWarningSuccess('failure', res.data.errMsg)
                        }
                        this.lockRepeatSubmit = false
                    }
                )
            },
            //table操作栏方法
            operating(type, item){
                if (type == 'edit') this.edit(item)
                if (type == 'delete') this.del(item)
            },
            //检验必填项
            check(){
                if (this.isFirst) {
                    if (this.actItem.name.trim() == '') {
                        this.setWarningSuccess('failure', '请输入一级分类名称')
                        return false
                    }
                    if (this.actItem.industryCategoryCode.trim() == '') {
                        this.setWarningSuccess('failure', '请选择行业类别')
                        return false
                    }
                    if (this.actItem.type == '') {
                        this.setWarningSuccess('failure', '请选择货品类别')
                        return false
                    }
                } else if (this.isSecond) {
                    if (this.actItem.name.trim() == '') {
                        this.setWarningSuccess('failure', '请输入二级分类名称')
                        return false
                    }
                }
                return true
            },
            clearTable(uid, obj){
                this.tableData = []
            }
        },
        computed: {
            tableCfg() {
                return cfg.tableCfg
            },
        },
    }
</script>
<template>
    <container>
        <div class="body_item">
            <div class="left_item">
                <div class="item_head between">
                    <a @click='addFirst'>
                        <i class="icon-hp_list__add"></i>新增
                    </a>
                </div>
                <div class="item_body">
                    <div class='list_div'>
                        <div class='list_tab'>
                            <a href="javascript:;" @click="choiceTab('001')" :class="{ckd:001==activeTab}">
                                成品
                            </a>
                            <a href="javascript:;" @click="choiceTab('002')" :class="{ckd:002==activeTab}">
                                半成品
                            </a>
                            <a href="javascript:;" @click="choiceTab('003')" :class="{ckd:003==activeTab}">
                                原料
                            </a>
                        </div>
                        <div>
                            <menu>
                                <submenu v-for="item in inventoryCategorys"
                                         :index="item.code"
                                         :has-children="item.children.length>0"
                                         @cb="checkThisLine(item)">
                                    <template slot="title">
                                        <div class="list-operate">
                                            <div>{{item.name}}</div>
                                            <div class="moreChangeColor"
                                                 style="position: absolute;top: 15px;right: 10px; ">
                                                <div :class='["dot-group" ,"more",{"active":item.code == current}]'
                                                     @click.stop='operatingItem(item.code)'>
                                                    <span></span><span></span><span></span>
                                                </div>
                                                <div class="more-group" v-show='item.code == current'>
                                                    <a @click.stop='editFirst(firstLv)' href="javascript:;">编辑一级分类</a>
                                                    <a @click.stop='addSecond(firstLv.code)'
                                                       href="javascript:;">添加二级分类</a>
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                    <menu-item v-for="info in item.children"
                                               :index="info.code"
                                               @cb="checkThisLine(info)">
                                        <div class="list-operate">
                                            <div>{{info.name}}</div>
                                            <div class="moreChangeColor"
                                                 style="position: absolute;top: 15px;right: 10px;">
                                                <div :class='["dot-group" ,"more",{"active":info.code == current}]'
                                                     @click.stop='operatingItem(info.code)'>
                                                    <span></span><span></span><span></span>
                                                </div>
                                                <div class="more-group" v-show='info.code == current'>
                                                    <a @click.stop='editSecond(info)' href="javascript:;">编辑二级分类</a>
                                                </div>
                                            </div>
                                        </div>
                                    </menu-item>
                                </submenu>
                            </menu>
                        </div>
                    </div>
                </div>
                <!-- <new-app :config='leftItemCfg' @tab='clearTable' @add="addFirst" @cb='getList'></new-app>-->
            </div>
            <div class="right_item">
                <div class="item_head btn-ic">
                </div>
                <div class="item_body">
                    <vtable :config='tableCfg' @op="operating" :data='tableData' @link="openInfo"></vtable>
                </div>
            </div>
        </div>
        <modal :config="infoCfg" @quite="quite" @sure="sure">
            <info @add="addSecond" :data='actItem' :add="isAdd" :first="isFirst" :second="isSecond"
                  :edit="isEdit"></info>
        </modal>

        <!-- 查看详情的 modal -->
        <modal :config="watchInfoCfg" @sure="sure">
            <info :data='actItem' :add="isAdd" :edit="isEdit"></info>
        </modal>

        <modal :config="ruleCfg" @quite="quite" @sure="sureRule">
            <rule :data='actInfoItem'></rule>
        </modal>

        <alert :config="delCfg" @cb="deleteData"></alert>

        <warning :config="warnCfg"></warning>
    </container>
</template>
<style lang='less' scoped>
    @import '../../../../../public/css/variable.less';

    .table-list tr td {
        overflow: hidden !important;
        white-space: normal !important;
    }

    .sub-title:hover .dot-group,.menu-item:hover .dot-group {
        visibility: visible;
    }

    .dot-group {
        visibility: hidden;
        display: flex;
        height: 14px;
        align-items: center;
        flex-direction: row;
        justify-content: center;
        cursor: pointer;

        &.active span {
            background-color: @link-color;
            visibility: visible;
        }

        span {
            display: flex;
            width: 5px;
            height: 5px;
            margin-right: 3px;
            border-radius: 50%;
            background-color: #ADADAD;
        }

    }

    .more-group {
        position: absolute;
        top: 50%;
        margin-top: 14px;
        margin-left: -70px;
        width: 100px;
        z-index: 3;
        background-color: @body-bg;
        border: 1px solid @border-color;

        a {
            display: block;
            text-align: left;
            font-size: 12px;
            margin: 10px 0;
            padding-left: 10px;
            color: @gray;

            &:hover {
                color: #03a9f4!important;
            }

        }

        &
        :before {
            content: '';
            position: absolute;
            top: -11px;
            left: 80%;
            margin-left: -5px;
            display: inline-block;
            width: 0;
            border: 5px solid transparent;
            border-bottom-color: @border-color;
        }

        &
        :after {
            content: '';
            position: absolute;
            top: -10px;
            left: 80%;
            margin-left: -5px;
            display: inline-block;
            width: 0;
            border: 5px solid transparent;
            border-bottom-color: @body-bg;
        }

        .blue {
            color: #008AF5;
        }

        .danger {
            color: #FF0700;
        }

        .normal {
            color: #757575;
        }

    }

    .item_head:hover {
        cursor: pointer;
    }

    .post-mangage {
        width: 100px !important;
    }

    .reset_password {
        text-align: center;

        img {
            width: 50px;
            height: 50px;
            margin-top: 20px;
        }

        .main {
            padding: 10px 30px;
            color: #212121;
            font-size: 12px;
        }

        .minor {
            padding: 10px;
            padding-bottom: 30px;
            color: #757575;
            font-size: 12px;
        }

    }





</style>
