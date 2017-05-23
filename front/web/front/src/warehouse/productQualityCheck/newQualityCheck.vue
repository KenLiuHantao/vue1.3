<script>

    export default {
        props: {
            docno: String
        },
        data() {
            return {
                warnConfig: {
                    show: false,
                    type: 'success',
                    content: '保存成功'
                },
                docDateConfig: {
                    placeholder: '请选择品检日期',
                    format: 'YYYY-MM-DD',
                    maxDate: '2100-01-01'
                },
                dig: {},
                uploadFileConfig: {
                    extensions: 'bmp, gif, jpg, jpeg, pic, png',
                    limit: 6
                },
                validShow: {
                    docDate: false
                },
                tableData: {header: {}, dataList: {}},
                lock: true,
            }
        },
        ready() {
        //请求精度
            this.$http.post(__URL.arc + 'parameter/digital/list').then(
                res => {
                let dataList =  res.data.data.dataList;
                dataList.forEach((data)=>{
                    if(data.code == 'quantity'){
                        this.dig = data.decimal;
                    }
                })
        })


            this.$http.get(__URL.warehouse + 'receive/query/one/' + this.docno, {}).then((res) => {
                this.tableData = res.data.data;
                this.lock = false;
                });
        },
        methods: {
            addImages(file) {
                this.tableData.dataList[index].images.push(file);
            },
            checkQuantity(){
                for (var i = 0; i < this.tableData.dataList.length; i++) {
                    if (this.tableData.dataList[i].badQuantity < 0) {
                        this.warnConfig.type = 'failure';
                        this.warnConfig.content = '请输入大于0的不良数量';
                        this.warnConfig.show = true;
                        return false;
                    }
                    if (this.tableData.dataList[i].goodQuantity < 0) {
                        this.warnConfig.type = 'failure';
                        this.warnConfig.content = '请输入大于0的合格数量';
                        this.warnConfig.show = true;
                        return false;
                    }
                }
                return true;
            },
            save() {
                if (!this.lock) {
                    this.lock = true;
                    if (this.checkQuantity()) {
                        this.$http.post(__URL.warehouse + 'product/quality/check/save', this.tableData).then((res) => {
                            this.warnConfig.show = true;
                        this.warnConfig.type = 'success';
                        this.warnConfig.content = '保存成功';
                        if (!res.data.success) {
                            this.warnConfig.type = 'failure';
                            this.warnConfig.content = res.data.errMsg;
                        } else {
                            this.$emit('refresh');
                        }
                        this.lock = false;
                    })
                        ;
                    }
                    ;
                }
            },
            cancel() {
                this.$emit('close');
            }
        },
        filters: {
            setGoodQuantity: {
                write(val, oldval, index){
                    let d = this.tableData.dataList[index]
                    d.badQuantity = (d.quantity - val).toFixed(this.dig);
                    return val
                },
            },
            setBadQuantity: {
                write(val, oldval, index){
                    let d = this.tableData.dataList[index]
                    d.goodQuantity = (d.quantity - val).toFixed(this.dig);
                    return val;
                }
            }
        }
    }

</script>
<template>
    <div class="inner-wrapper">
        <div class="inner-content">
            <h2 class="tag">品质检验单信息</h2>
            <div class="block">
                <!-- inner-item这个dom节点可以增加自己的类名为了方便展示下级排版 -->
                <div class="inner-item form-box">
                    <div class="form-group">
                        <label>单号:</label>
                        <p class="orderData">{{ tableData.header.purchaseDocNo }}</p>
                    </div>
                    <div class="form-group">
                        <label>品检日期:</label>
                        <date-picker :config="docDateConfig" :date.sync='tableData.header.docDate'></date-picker>
                        <i class="error" v-show='validShow.docDate'>品检日期不能为空</i>
                    </div>
                    <div class="form-group">
                        <label>品检员:</label>
                        <p class="orderData">{{ tableData.header.employeeName }}</p>
                    </div>
                </div>

                <div class="inner-item">
                    <div class="form-group wd-100">
                        <label>备注:</label>
                        <input type="text" maxlength='120' v-model='tableData.header.remark'>
                    </div>
                </div>

                <div class="inner-item">
                    <tab-container>
                        <tab-item>
                            <table class='inner-table'>
                                <thead>
                                <tr>
                                    <th width="5%">序号</th>
                                    <th width="15%">货品信息</th>
                                    <th width="5%">单位</th>
                                    <th width="10%">检验数量</th>
                                    <th width="10%">合格允收数量</th>
                                    <th width="10%">不良退收数量</th>
                                    <th width="10%">不良原因</th>
                                    <th width="15%">不良图片</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for='item in tableData.dataList'>
                                    <td>{{$index + 1}}</td>
                                    <td>
                                        <div class="show-wrap">
                                            <p><label>编码:</label><label>{{item.inventoryCode}}</label></p>
                                            <p><label>名称:</label><label>{{item.inventoryName}}</label></p>
                                            <p><label>型号:</label><label>{{item.inventorySpec}}</label></p>
                                        </div>
                                    </td>
                                    <td>{{ item.unitName }}</td>
                                    <td>{{ item.quantity }}</td>
                                    <td>
                                        <input-number class="wd100"
                                                      :code.sync="item.goodQuantity | setGoodQuantity  $index"
                                                      placeholder="请输入合格允收数量"></input-number>
                                    </td>
                                    <td>
                                        <input-number class="wd100"
                                                      :code.sync="item.badQuantity | setBadQuantity  $index"
                                                      placeholder="请输不良退收数量"></input-number>
                                    </td>
                                    <td><input type="text" maxlength='120' v-model='item.reason'></td>
                                    <td>
                                        <upfile-group :config='uploadFileConfig' :data="item.images"
                                                      :edit="true"></upfile-group>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </tab-item>
                    </tab-container>
                </div>
            </div>
        </div>
    </div>
    <div class="inner-footer">
        <button @click='cancel' class="btn-xl-def">取消</button>
        <button @click='save' class="btn-xl-imp">品检确认</button>
    </div>

    <warning :config="warnConfig"></warning>
</template>

<style lang='less' scoped>
    @import '../../../../../public/css/variable.less';

</style>