<script>
    import _ from 'lodash'
    export default {
        props: ['data', 'add', 'edit', 'first', 'second'],
        data(){
            return {
                firstCategory: [],
                secondCategory: [],
                typeData: [{
                    inventoryTypeName: '成品',
                    inventoryTypeCode: '001'
                }, {
                    inventoryTypeName: '半成品',
                    inventoryTypeCode: '002'
                }, {
                    inventoryTypeName: '原料',
                    inventoryTypeCode: '003'
                }],
            }
        },
        ready(){
            if (this.add || this.edit) {
                this.getFirstCategory()
                //this.getType()
            }
        },
        methods: {
            addSecond(){
                this.$emit("add", this.data.code);
            },
            //获取大类
            getFirstCategory(){
                this.getData(__URL.arc + 'industry/category/first', 'firstCategory')
            },
            //获取数据
            getData(url, context){
                this.$http.get(url).then(
                    res => {
                        if (res.data.success) {
                            this[context] = res.data.data
                        }
                    }
                )
            },

        },
    }
</script>
<template>
    <template v-if="first">
        <div>
            <div class="form-group">
                <label><span v-if="edit || add" class="must-point">*</span>货品分类名称:</label>
                <input v-if="edit || add" type="text" v-model="data.name" placeholder="请输入货品一级分类">
                <p v-else>{{data.name}}</p>
            </div>
            <div class="form-group">
                <label><span v-if="edit || add" class="must-point">*</span>行业分类:</label>
                <select v-if="edit || add" v-model="data.industryCategoryCode">
                    <option v-for="item in firstCategory" :value="item.industryCategoryCode">
                        {{item.industryCategoryName}}
                    </option>
                </select>
                <p v-else>{{data.firstIndustryCategoryName}}</p>
            </div>
            <div class="form-group">
                <label><span v-if="edit || add" class="must-point">*</span>存货类别:</label>
                <select v-if="edit || add" v-model="data.type" placeholder="请选择类别">
                    <option v-for="item in typeData" :value="item.inventoryTypeCode">{{item.inventoryTypeName}}</option>
                </select>
                <p v-else>{{data.inventoryTypeName}}</p>
            </div>
            <div style="position: absolute;bottom: 20px;left: 15px;color: #03a9f4;z-index: 99999999999;">
                <a href="javascript:;" v-if='edit' @click='addSecond'>
                    <i class="icon-hp_list__add"></i>添加二级分类
                </a>
            </div>
        </div>
    </template>
    <template v-if="second">
        <div class="form-group">
            <label><span v-if="edit || add" class="must-point">*</span>货品分类名称:</label>
            <input v-if="edit || add" type="text" v-model="data.name"
                   placeholder="请添加对应一级分类下的二级分类">
            <p v-else>{{data.name}}</p>
        </div>
        <div class="form-group">
            <label><span v-if="edit || add"></span>备注:</label>
            <input v-if="edit || add" type="text" v-model="data.remark" placeholder="输入备注">
            <p v-else>{{data.remark}}</p>
        </div>
    </template>
</template>
<style lang="less" scoped>

    .form-group {
        width: 100%;
        margin-top: 20px;
        align-items: center;

        label {
            width: 100px;
        }

        input, select {
            width: 440px;
        }
    }
</style>

