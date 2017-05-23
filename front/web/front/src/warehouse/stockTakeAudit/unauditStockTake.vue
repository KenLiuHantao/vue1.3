<script>

    export default {
        props: ['config', 'docno'],
        data() {
            return {
                profitTypeText: {
                    '1': '入库单据未及时审核盘盈',
                    '2': '出库单据未及时审核盘亏',
                    '3': '出库单据重复录入盘盈',
                    '4': '入库单据重复录入盘亏',
                    '5': '供应商备品未入账盘盈',
                    '6': '实物损毁盘亏',
                    '7': '其他'
                },
                warnConfig: {
                    show: false,
                    type: 'failure',
                    content: '',
                    showTime: '2000'
                },
                tableData: {header:{},dataList:{}},
                lock: true
        }
        },
        ready() {
            this.$http.get(__URL.warehouse + 'stock/take/material/query/one/' + this.docno, {}).then((res) => {
                this.tableData = res.data.data;
                 this.lock=false;
             });
        },
        methods: {
            showWarnMsg(type, msg) {
                this.warnConfig.show = true;
                this.warnConfig.type = type;
                this.warnConfig.content = msg;
            },
            cancel() {
                this.$emit('close');
            },
            unaudit() {
                if(!this.lock) {
                    this.lock = true;
                    this.$http.post(__URL.warehouse + 'stock/take/material/audit/0', this.buildData()).then( (res) => {
                        if(res.data.success) {
                        this.showWarnMsg('success', '弃审成功');
                        this.$emit('refresh')
                    } else {
                        this.showWarnMsg('warning', res.data.errMsg);
                    }
                    this.lock = false;
                });
                }
            },
            buildData() {
                let reqData = {
                    docNo: this.tableData.header.docNo,
                    recordVersions: []
                }
                for(let i = 0; i < this.tableData.dataList.length; i++) {
                    let obj = this.tableData.dataList[i];
                    reqData.recordVersions.push({
                        recordId: obj.recordId,
                        recordVersion: obj.recordVersion
                    });
                }
                return reqData;
            }
        }
    }
</script>
<template :config='config'>
    <div class="inner-wrapper">
        <div class="inner-content">
            <h2 class="tag two-tag"><label>盘点单信息</label><label class="ft-14">盘点单号: {{ docno }}</label></h2>

            <div class="block">
                <!-- inner-item这个dom节点可以增加自己的类名为了方便展示下级排版 -->
                <div class="inner-item form-box">
                    <div class="form-group">
                        <label>仓库:</label>
                        <p class="orderData">{{ tableData.header.warehouseName }}</p>
                    </div>
                    <div class="form-group">
                        <label>仓管员:</label>
                        <p class="orderData">{{ tableData.header.employeeName }}</p>
                    </div>
                    <div class="form-group">
                        <label>盘点日期:</label>
                        <p class="orderData">{{ tableData.header.docDate }}</p>
                    </div>
                </div>
            </div>

            <div class="inner-item">
                <tab-container>
                    <tab-item>
                        <table class="inner-table">
                            <thead>
                            <tr>
                                <th width="4%">序号</th>
                                <th width="15%">货品信息</th>
                                <th width="7%">单位</th>
                                <th width="8%">账面数量</th>
                                <th width="12%">实盘数量</th>
                                <th width="8%">辅单位</th>
                                <th width="8%">换算率</th>
                                <th width="8%">实盘辅数量</th>
                                <th width="8%">盈亏数量</th>
                                <th width="16%">盈亏类型</th>
                                <th width="8%">备注</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="(index,item) in tableData.dataList">
                                <td>{{ $index+1 }}</td>
                                <td>
                                    <div class="show-wrap">
                                        <p><label>编码:</label><label>{{item.inventoryCode}}</label></p>
                                        <p><label>名称:</label><label>{{item.inventoryName}}</label></p>
                                        <p><label>型号:</label><label>{{item.inventorySpec}}</label></p>
                                    </div>
                                </td>
                                <td>{{item.unitName}}</td>
                                <td>{{item.bookQuantity}}</td>
                                <td>{{item.firmQuantity}}</td>
                                <td>{{item.byUnitName}}</td>
                                <td>{{item.conversionRate}}</td>
                                <td>{{item.byFirmQuantity}}</td>
                                <td>{{item.profitQuantity}}</td>
                                <td>{{ profitTypeText[item.profitType] }}</td>
                                <td>{{item.rowRemark}}</td>
                            </tr>
                            </tbody>
                        </table>
                    </tab-item>
                </tab-container>
            </div>
        </div>
    </div>


    <div class="inner-footer">
        <button class="btn-xl-def" @click="this.config.show = false;">取消</button>
        <ajax-button class="btn-xl-imp" @click="unaudit">取消审核</ajax-button>
    </div>

    <!--警告-->
   <warning :config="warnConfig"></warning>
</template>

<style lang='less' scoped>
    @import '../../../../../public/css/variable.less';
</style>