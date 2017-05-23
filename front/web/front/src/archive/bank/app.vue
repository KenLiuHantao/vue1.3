<script>
    import cfg from './cfg.js'
    import newBank from './newBank'
    import editBank from './editBank'

    export default {
        components: {
            newBank,
            editBank,
        },
        ready() {
            document.addEventListener('click', () => {
                this.currentIndex = -1
            })
        },
        data() {
            return {
                addConfig: {
                    show: false,
                    width: '410px',
                    height: 'auto',
                    header: '新增银行',
                    btn: [{
                        name: '取消',
                        emit: 'quite'
                    }, {
                        name: '确定',
                        emit: 'sure'
                    }],
                },
                editConfig: {
                    show: false,
                    width: '410px',
                    height: 'auto',
                    header: '编辑银行',
                    btn: [{
                        name: '取消',
                        emit: 'quite'
                    }, {
                        name: '确定',
                        emit: 'sure'
                    }],
                },
                msgConfig: {
                    show: false,
                    content: '提交成功',
                    type: 'success'
                },
                leftItemCfg: cfg.leftItemCfg,
                listObj: cfg.listParam,
                tableData: [],
                listData: {},
                currentIndex: -1,
                bankDetail: {
                    "account": "",
                    "accountBranch": "",
                    "accountNumber": "",
                    "bankAccountCode": "",
                    "bankCode": "",
                    "bankName": "",
                    "currencyCode": "",
                    "currencyName": "",
                    "isDefault": 0,
                    "isUsing": 0
                },
                selectedObj: "",
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
            add(){

                this.addConfig.show = true;
            },
            // table返回的操作参数
            operate(type, item) {
            },
            href(item, type) {
                if (type === "docNo") {
                    var docNo = item.docNo
                    this.$http.post(__URL.arc + 'bankaccount/list' + docNo).then(
                        (res) => {

                        });
                }
            },
            getFilter(item, obj) {
                console.log(item, obj)
                if (obj && obj.bankCode != undefined) {
                    item.bankCode = obj.bankCode;
                    this.selectedObj = obj;
                } else {
                    this.selectedObj = "";
                }
                this.getList(item);
            },
            /* 数据请求 */
            getList(obj) {
                this.$http.post(__URL.arc + 'bankaccount/list', obj).then(
                    res => {
                        if (res.data.success) {
                            this.listData = res.data.data.dataList;
                        } else {
                            this.msgConfig.show = true
                            this.msgConfig.type = "failure";
                            this.msgConfig.content = res.data.errMsg
                        }
                    }
                )
            },
            //显示操作按钮
            optionThisLine(val) {
                this.currentIndex = val
            },
            edit(item){
                this.bankDetail.account = item.account;
                this.bankDetail.accountBranch = item.accountBranch;
                this.bankDetail.accountNumber = item.accountNumber;
                this.bankDetail.bankAccountCode = item.bankAccountCode;
                this.bankDetail.bankCode = item.bankCode;
                this.bankDetail.bankName = item.bankName;
                this.bankDetail.currencyCode = item.currencyCode;
                this.bankDetail.currencyName = item.currencyName;
                this.bankDetail.isDefault = item.isDefault;
                this.bankDetail.isUsing = item.isUsing;
                this.editConfig.show = true;
            },
            updateUsing(item){
                item.isUsing = !item.isUsing;
                this.$http.post(__URL.arc + 'bankaccount/update/using', item).then(
                    res => {
                        if (res.data.success) {
                            this.msgConfig.show = true;
                            this.msgConfig.type = "success";
                            this.msgConfig.content = "修改成功";
                        } else {
                            item.isUsing = !item.isUsing;
                            this.msgConfig.show = true;
                            this.msgConfig.type = "failure";
                            this.msgConfig.content = res.data.errMsg;
                        }
                    }
                )
            },
            updateDefault(item){
                this.$http.get(__URL.arc + 'bankaccount/update/default/' + item.bankAccountCode).then(
                    res => {
                        if (res.data.success) {
                            this.refresh("success", "设置成功");
                            this.getList(this.selectedObj);
                        } else {
                            this.msgConfig.show = true;
                            this.msgConfig.type = "failure";
                            this.msgConfig.content = res.data.errMsg;
                        }
                    }
                )
                console.log(item);
            },

            closeNew(type, tips){
                this.refresh(type, tips)
            },

            setWarningSuccess(type, tips){
                this.msgConfig.show = true
                this.msgConfig.content = tips
                this.msgConfig.type = type
            },

            refresh(type, tips){
                console.log(tips)
                this.setWarningSuccess(type, tips)
                this.$broadcast('_RESETLIST');
                this.listData = {}
            },

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
                <new-app :config='leftItemCfg' @cb='getFilter' @add='add'></new-app>
            </div>
            <div class="right_item">
                <div class="item_head btn-ic">

                </div>
                <div class="item_body">
                    <table class="table-wrap">
                        <thead>
                        <tr>
                            <!--<th width="5%" class="text-left">序号</th>-->
                            <th width="30%">账号名</th>
                            <th width="15%">开户银行网点</th>
                            <th width="10%">开户账号</th>
                            <th width="15%">状态</th>
                            <th width="10%">默认账户</th>
                            <th width="10%">操作</th>
                        </tr>
                        </thead>
                        <tbody v-show="listData.length">
                        <tr v-for="item in listData">
                            <!--<td class="text-left">{{$index+1}}</td>-->
                            <td>{{item.account}}</td>
                            <td>{{item.accountBranch}}</td>
                            <td>{{item.accountNumber}}</td>
                            <td>
                                {{item.isUsing ? '已启用' :'已停用' }}
                            </td>
                            <td>
                                <span @click="updateDefault(item)" v-if="item.isUsing" :class="{'red':item.isDefault }"> {{item.isDefault ? '默认账户':'设为默认'}}</span>
                                <p class="grayed" v-else>设为默认</p>
                            </td>
                            <td class="option">
                                <div class="option-wrap">
                                    <div class="dot-group" :class="{'active':currentIndex == $index}"
                                         @click.stop="optionThisLine($index)">
                                        <span></span><span></span><span></span>
                                    </div>
                                    <div v-show='currentIndex == $index' class="button-group">
                                        <span class="arrow"></span>
                                        <div class="opt success" v-if="item.isUsing" @click="edit(item)">编辑</div>
                                        <div class="opt danger" v-if="item.isUsing" @click="updateUsing(item)">停用</div>
                                        <div class="opt success" v-if="!item.isUsing" @click="updateUsing(item)">启用
                                        </div>
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
    <!--新增/编辑 -->
    <!--<inner :config="innerCfg">-->
    <!--<info :show.sync="innerCfg.show" @refresh="refresh" :isedit="isEdit" :anid="actId"></info>-->
    <!--</inner>-->
    <!--&lt;!&ndash;预览&ndash;&gt;-->
    <!--<inner :config="preCfg">-->
    <!--<preview :show.sync="preCfg.show" :anid="actId"></preview>-->
    <!--</inner>-->
    <!--提示信息-->

    <warning :config="msgConfig"></warning>

    <new-bank :detail.sync="addConfig" @refresh='closeNew'></new-bank>

    <edit-bank :bank-detail.sync="bankDetail" :detail.sync="editConfig" @refresh='closeNew'></edit-bank>

    <!--&lt;!&ndash;删除确认&ndash;&gt;-->
    <!--<alert :config="delCfg" @cb="delSure">是否确认删除此公告？</alert>-->
    <!--&lt;!&ndash;停用确认&ndash;&gt;-->
    <!--<alert :config="stopCfg" @cb="stopSure">是否确认停用此公告？</alert>-->
</template>

<style lang="less" scoped>
    @import '../../../../../public/css/variable.less';

    .red {
        border: 1px dashed red;
        color: red !important;
        display: inline !important;
        padding: 3px 5px;
    }
    .grayed {
        color: gray;
    }

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
        .published{
            color: #61BA5B;
        }
        .wait-publish{
            color: #FF5722;
        }
        .text-left{
            text-align: left;
        }
        a{
            color: @link-color;
            max-width: 250px;
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
            .disabled{
                color: @gray-sub;
            }
            .danger{
                color: #FF0700;
            }
        }
    }

</style>

