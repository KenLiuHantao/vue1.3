<script>
    import upload from 'nc/uploadfile/app'
    import tabbar from 'nc/tab/page-tab-bar'
    import tabcont from 'nc/tab/tab-container'
    import containeritem from 'nc/tab/tab-container-item'
    export default {
        components: {
            tabbar,
            tabcont,
            containeritem,
            upload
        },
        data() {
            return {
                valiVal: '',
                isMainContacts: 1,
                defaultRow: {
                    id: "",
                    contacts: "",
                    job: "",
                    mobile: "",
                    address: "",
                    email: "",
                    isMain: "0"
                },
                modalCfg: {
                    show: false,
                    title: '新增供应商档案'
                },
                tabConfig: {
                    type:'page',
                    select: '',
                    tabBarData: [{
                        id: 'contactsTab',
                        name: '联系人',
                        icon: 'icon-ierp'
                    }]
                },
                tableConfig: {
                    tableRowData: []
                }
            }
        },
        methods: {
            modal() {
                this.modalCfg.show = true;
                this.tableConfig.tableRowData.length = 0;
                this.addRow();
            },
            addRow() {
                var tmpDefaultRow = Object.assign({}, this.defaultRow);
                this.tableConfig.tableRowData.push(tmpDefaultRow);
            },
            delRow(index) {
                if (this.tableConfig.tableRowData.length == 1) {
                    alert("表格必须保留一行！");
                    return;
                }
                this.tableConfig.tableRowData.splice(index, 1);
            },
            saveData() {

            },
            changeIsMain(val) {
                let tmpData = this.tableConfig.tableRowData;
                tmpData.forEach(function (item) {
                    item.isMain = 0
                });
                val.isMain = 1
            }
        }
    }
</script>
<template>
    <button class="btn-lg-imp" @click='modal'>内页弹窗按钮</button>
    <!-- 弹框内置dom结构 -->
    <inner :config='modalCfg'>
        <div class="inner-wrapper">
            <div class="inner-content">
                <h2 class="tag">供应商档案信息</h2>
                    <!-- inner-item这个dom节点可以增加自己的类名为了方便展示下级排版 -->
                    <div class="inner-item form-box">
                        <div class="form-group">
                            <label><span class="must-point">*</span>供应商名称:</label>
                            <input type="text">
                        </div>
                        <div class="form-group">
                            <label><span class="must-point">*</span>供应商分类:</label>
                            <!-- 如果要加验证请加外层dom -->
                            <div class="vaGroup">
                                <select name="suplier">
                                    <option>
                                        ssss
                                    </option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label><span class="must-point">*</span>供应商行业:</label>
                            <input type="text" v-model="suplierIndustry"/>
                        </div>
                        <div class="form-group">
                            <label><span class="must-point">*</span>采购员:</label>
                            <!-- 如果要加验证请加外层dom -->
                            <div class="vaGroup">
                                <select name="suplier">
                                    <option>
                                        ssss
                                    </option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label><span class="must-point">*</span>默认币种:</label>
                            <!-- 如果要加验证请加外层dom -->
                            <div class="vaGroup">
                                <select name="suplier">
                                    <option>
                                        ssss
                                    </option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label><span class="must-point">*</span>税率(%):</label>
                            <input type="text">
                        </div>
                        <div class="form-group">
                            <label><span class="must-point">*</span>付款条件:</label>
                            <!-- 如果要加验证请加外层dom -->
                            <div class="vaGroup">
                                <select name="suplier">
                                    <option>
                                        ssss
                                    </option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label><span class="must-point">*</span>结算方式:</label>
                            <!-- 如果要加验证请加外层dom -->
                            <div class="vaGroup">
                                <select name="suplier">
                                    <option>
                                        ssss
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="uploadBox inner-item">
                        <div class="form-group">
                            <label>上传附件:</label>
                            <upload></upload>
                        </div>
                        <div class="form-group">
                            <label>备注:</label>
                            <textarea></textarea>
                        </div>
                    </div>
                    <div class="inner-item">
                        <tabbar :config.sync='tabConfig'></tabbar>
                        <tabcont :active.sync='tabConfig.select'>
                            <containeritem id='contactsTab'>
                                <table class="inner-table mt-15">
                                    <thead>
                                    <tr>
                                        <th width="30px">序号</th>
                                        <th width="15%">
                                            <span class="must-point">*</span>
                                            联系人</th>
                                        <th width="15%">职务</th>
                                        <th width="15%">
                                            <span class="must-point">*</span>
                                            联系电话</th>
                                        <th width="30%">地址</th>
                                        <th width="25%">E-mail</th>
                                        <th width="100px" colspan="2">默认订单联系人</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr v-for="(index,item) in tableConfig.tableRowData">
                                        <td>{{ $index+1 }}</td>
                                        <td>
                                            <input type="text" v-va:constacts="item.contacts" tag="联系人"
                                                   v-model="item.contacts">
                                        </td>
                                        <td>
                                            <input type="text" v-model="item.job">
                                        </td>
                                        <td>
                                            <input type="text" v-model="item.mobile">
                                        </td>
                                        <td>
                                            <input type="text" v-model="item.address">
                                        </td>
                                        <td>
                                            <input type="text" v-model="item.email">
                                        </td>
                                        <td>
                                            <input type="radio" @click="changeIsMain(item)" v-model="item.isMain"
                                                   :value="1">
                                        </td>
                                        <td>
                                            <a href="javascript:;" @click="delRow($index)">删除</a>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                                <div class="add-wrap" >
                                 <button @click="addRow"><i class="icon icon-add-data" ></i> 新增联系人</button>
                                </div>
                            </containeritem>
                        </tabcont>
                    </div>
            </div>
        </div>
        <div class="inner-footer">
            <button class="btn-xl-def" @click="this.modalCfg.show=false">取消</button>
            <button class="btn-xl-imp" @click="saveData">保存</button>
        </div>
    </inner>
</template>
<style lang="less" scoped>

    @import "../../../public/css/variable.less";


</style>
