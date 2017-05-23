<script>
import upload from 'nc/uploadfile/app'
import ug from 'nb/uploadGroup/app'
import tabbar from 'nc/tab/page-tab-bar'
import tabcont from 'nc/tab/tab-container'
import containeritem from 'nc/tab/tab-container-item'
import checkcustomer from 'nb/fuzzy/customer'

export default {
    components: {
        tabbar,
        tabcont,
        containeritem,
        upload,
        checkcustomer,
        ug
    },
    data() {
        return {
            valiVal: '',
            modalCfg: {
                show: false,
                title: '销售订单'
            },
            tabConfig: {
                type:'page',
                select: '',
                tabBarData: [{
                    id: 'tab1',
                    name: '开发',
                    icon: 'icon-teamwork'
                }, {
                    id: 'tab2',
                    name: '销售',
                    icon: 'icon-teamwork'
                }]
            },
            customer:{
                customerName:'',
                customerCode:''
            },
            uCfg:{
                limit:5,
           },
           isEdit:false,
           upData:[]
        }
    },
    methods: {
        modal() {
            this.modalCfg.show = true
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

                <h2 class="tag">销售订单信息</h2>

                <div class="inner-item form-box">
                    <div class="form-group">
                        <label><span class="must-point">*</span>货品编码:</label>
                        <!-- 如果要加验证请加外层dom -->
                        <div class="vaGroup">
                            <input type="text" v-model='valiVal'>
                        </div>
                    </div>
                    <div class="form-group">
                        <label><span class="must-point">*</span>货品名称:</label>
                        <input type="text">
                    </div>
                    <div class="form-group">
                        <label>规格型号:</label>
                        <input type="text">
                    </div>
                    <div class="form-group">
                        <label><span class="must-point">*</span>货品分类:</label>
                        <checkcustomer :data="customer"></checkcustomer>
                    </div>
                    <div class="form-group">
                        <label><span class="must-point">*</span>货品属性:</label>
                        <input type="text">
                    </div>
                    <div class="form-group">
                        <label><span class="must-point">*</span>默认仓库:</label>
                        <input type="text">
                    </div>
                    <div class="form-group">
                        <label><span class="must-point">*</span>计量单位:</label>
                        <input type="text">
                    </div>
                </div>

                <div class="inner-item mt-15">
                    <div class="form-group">
                        <label>上传附件</label>
                        <checkcustomer :config="inventoryCfg"  :data="customer"> </checkcustomer>
                    </div>
                    <div class="form-group">
                        <label>上传图片</label>
                        <upload></upload>
                    </div>
                </div>

                <div class="inner-item">
                    <tabbar :config.sync='tabConfig'></tabbar>
                    <tabcont :active.sync='tabConfig.select'>
                        <containeritem id='tab1'>
                            <table class="inner-table mt-15">
                                <thead>
                                <tr>
                                    <th width="25">1</th>
                                    <th width="25">2</th>
                                    <th width="25">3</th>
                                    <th width="25">4</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>2</td>
                                    <td>3</td>
                                    <td>4</td>
                                </tr>
                                </tbody>
                            </table>
                        </containeritem>
                        <containeritem id='tab2'>
                            <h3>tab2</h3>
                        </containeritem>
                    </tabcont>
                </div>

                <div class="inner-item">
                    <table class="inner-table">
                        <thead>
                        <tr>
                            <th width="25%">1</th>
                            <th width="25%">2</th>
                            <th width="25%">3</th>
                            <th width="25%">4</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>
                                <div class="edit-check-wrap">
                                    <div class="check-input">
                                        <checkcustomer :config="inventoryCfg"  :data="customer"> </checkcustomer>
                                    </div>
                                    <input type="text" class="check-input" disabled v-model="">
                                    <input type="text" class="check-input" disabled v-model="">
                                    <input type="text" disabled v-model="">
                                </div>
                            </td>
                            <td>
                                <div class="show-wrap">
                                    <p>编码:123</p>
                                    <p>名称:123</p>
                                    <p>规格型号:123</p>
                                    <p>属性:123</p>
                                </div>
                            </td>
                            <td class="text-right">3</td>
                            <td>4</td>
                        </tr>
                        </tbody>
                    </table>

                    <div class="add-wrap" >
                        <button ><i class="icon icon-product__add" ></i>&nbsp;增加货品</button>
                    </div>

                </div>
            </div>
        </div>

        <div class="inner-footer">
            <button class="btn-xl-def">取消</button>
            <button class="btn-xl-imp">保存</button>
            <button class="btn-xl-danger">删除</button>
        </div>
    </inner>
</template>
<style lang='less' scoped>
    /* 此处为自己定义的样式 */
</style>
