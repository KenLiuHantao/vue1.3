<script>
    import _ from 'lodash'
    export default {
        props: ['data'],
        data(){
            return {
                wareData: [],
                status: [{code: 0, name: '未启用'}, {code: 1, name: "启用"}],
            }
        },
    }
</script>
<template>
    <div class="inner-item form-box">
        <div class="form-group">
            <p style="margin-left: 10px;">规则项目</p>
        </div>
        <div class="form-group">
            <p style="margin-left: 10px;">规则定义</p>
        </div>
        <div class="form-group">
            <p style="margin-left: 10px;">启用状态</p>
        </div>
        <div class="form-group">
            <p style="margin-left: 10px;">{{data.typeName}}</p>
        </div>
        <div class="form-group">
            <select style="margin-top: -10px;width: 100px;" v-model='data.value'>
                <option v-for='item in data.selections' :value='item.code'>{{item.name}}</option>
            </select>
        </div>
        <div class="form-group">
            <select style="margin-top: -10px;width: 100px;" v-model="data.recordStatus">
                <option v-for="item in status" :value="item.code">{{item.name}}</option>
            </select>
        </div>
    </div>
</template>
<style lang="less" scoped>

    .form-group {
        width: 33%;
        margin-top: 20px;
        float: left;
        align-items: center;
    }

    input, select {
        width: 440px;
    }
</style>

