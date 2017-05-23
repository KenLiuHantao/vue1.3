<script>
import ware from 'nb/fuzzy/warehouse'
export default {
    components: {
        ware
    },
    props: ['config', 'data'],
    watch: {
        config: {
            deep: true,
            handler(val, old) {
                this.modalCfg.show = val.show
            }
        },
        modalCfg: {
            deep: true,
            handler(val, old) {
                this.config.show = val.show
            }
        }
    },
    ready() {
        let params = {
            "pageIndex": 0,
            "pageSize": 0
        }
        this.$http.post(__URL.arc + 'warehouse/find/ref', params).then(
            (res) => {
                this.wareData = res.data.data.dataList;
            }
        )
    },
    data() {
        return {
            modalCfg: {
                show: false,
                header: '货品信息',
                width: '450px',
                height: '550px',
                btn:[{
                    name:'取消',
                    emit:'quite'
                },{
                    name:'确定',
                    emit:'sure'
                }]
            },
            msgCfg: {
                show: false,
                type: 'success',
                content: ''
            },
            attributeGroup: [{
                key: 0,
                value: '采购件'
            }, {
                key: 1,
                value: '自制件'
            }, {
                key: 2,
                value: '委外加工件'
            //}, {
            //    key: 3,
            //    value: '虚拟件'
            }],
            typeGroup: [{
                key: '001',
                value: '成品'
            }, {
                key: '002',
                value: '半成品'
            }, {
                key: '003',
                value: '原料'
            }],
            empMod: {
                show: false
            },
            proMod: {
                show: false
            },
            wareData:[]
        }
    },
    methods: {
        copyParam(base, target) {
            let tk = Object.keys(target)

            for (let i in base) {
                if (tk.indexOf(i) != -1) {
                    target[i] = base[i]
                }
            }
        },
        saveItem() {
            this.$http.post(__URL.osiu + '/import/init/inventory/update', this.data).then(
                res => {
                    if (res.data.success) {
                        this.msgCfg.type = 'success'
                        this.msgCfg.content = res.data.data
                        this.config.show = false
                        this.$parent.refresh()
                    } else {
                        this.msgCfg.type = 'failure'
                        this.msgCfg.content = res.data.errMsg
                    }
                    this.msgCfg.show = true
                }
            )
        },
        quite() {
            this.config.show = false;
            //this.$parent.refresh();
        },
        changeWarehouse(){
            this.data.warehouseCode = "";
            /*for(var i=0;i<this.wareData.length;i++){
                if(this.data.warehouseCode==this.wareData[i].warehouseCode){
                    this.data.warehouseName=this.wareData[i].warehouseName;
                }
            }*/
        }
    },
    filters: {
        getAttr: {
            twoWay: true,
            read(val) {
                return val
            },
            write(val, oldval) {
                return val
            }
        },
        getType:{
            twoWay: true,
            read(val) {
                return val
            },
            write(val, oldval) {
                return val
            }
        }
    }
}

</script>
<template>
    <modal :config.sync='modalCfg' @sure='saveItem' @quite='quite'>
        <div class="cont">
            <div class="form-group">
                <label><span class="must-point">*</span>一级分类:</label>
                <div class="s-input">
                    <input type="text" v-model='data.firstInventoryCategoryName' maxlength="20">
                </div>
            </div>
            <div class="form-group">
                <label>二级分类:</label>
                <div class="s-input">
                    <input type="text" v-model='data.secondInventoryCategoryName' maxlength="20">
                </div>
            </div>
            <div class="form-group">
                <label><span class="must-point">*</span>货品编码:</label>
                <div class="s-input">
                    <input type="text" v-model='data.inventoryCode' maxlength="30">
                </div>
            </div>
            <div class="form-group">
                <label><span class="must-point">*</span>货品名称:</label>
                <div class="s-input">
                    <input type="text" v-model='data.inventoryName' maxlength="60">
                </div>
            </div>
            <div class="form-group">
                <label>规格型号:</label>
                <div class="s-input">
                    <input type="text" v-model='data.inventorySpec' maxlength="115">
                </div>
            </div>
            <div class="form-group">
                <label><span class="must-point">*</span>货品类别:</label>
                <div class="s-input">
                    <select v-model='data.inventoryTypeName | getType'>
                        <option v-for='type in typeGroup' :value='type.value'>{{type.value}}</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label><span class="must-point">*</span>计量单位:</label>
                <div class="s-input">
                    <input type="text" v-model='data.unitName' maxlength="20">
                </div>
            </div>
            <div class="form-group">
                <label><span class="must-point">*</span>货品属性:</label>
                <div class="s-input">
                    <select v-model='data.attributeName | getAttr'>
                        <option v-for='attr in attributeGroup' :value='attr.value'>{{attr.value}}</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label><span class="must-point">*</span>默认仓库:</label>
                <input type="hidden" v-model="data.warehouseCode">
                <div class="s-input">
                    <input type="text" @change="changeWarehouse" v-model="data.warehouseName" >
                </div>
                <!--<div class="s-input">
                    <select v-model='data.warehouseCode' @change='changeWarehouse'>
                        <option v-for='item in wareData' :value='item.warehouseCode'>{{item.warehouseName}}</option>
                    </select>
                </div>-->
            </div>
            <div class="form-group">
                <label><span class="must-point">*</span>数量:</label>
                <div class="s-input">
                    <input type="text" v-model='data.quantity' maxlength="16" onkeyup="value=value.replace(/[^\d\.]/g,'')">
                </div>
            </div>
            <div class="form-group">
                <label>销售价:</label>
                <div class="s-input">
                    <input type="text" v-model='data.customerPrice' maxlength="16" onkeyup="value=value.replace(/[^\d\.]/g,'')">
                </div>
            </div>
            <div class="form-group">
                <label>采购价:</label>
                <div class="s-input">
                    <input type="text" v-model='data.purchasePrice' maxlength="16" onkeyup="value=value.replace(/[^\d\.]/g,'')">
                </div>
            </div>
        </div>
    </modal>
    <warning :config='msgCfg'></warning>
</template>
<style lang='less' scoped>

    .cont {
        height: 440px;
        padding: 15px 0;
        overflow-y: scroll;
    }
</style>
