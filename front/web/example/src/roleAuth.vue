<script>
   import referRoleAuth from 'nb/refer/roleAuth'
    export default {
        components:{
            referRoleAuth
        },
        data(){
            return{
                funCfg:{
                    show:false
                },
                data:JSON.parse('[{"id":314,"version":0,"createDate":"2017-03-18 16:19","updateDate":"2017-03-28 20:41","code":"M1045","name":"成品入库与出库管理","remark":"成品入库与出库管理","sort":35,"category":"成品仓仓管","alias":"成品入库与出库管理","domClass":"icon-finished_product__manage","url":"","antMatcher":"","postTypes":null,"postTags":null,"modelTypes":null,"communion":false},{"id":317,"version":0,"createDate":"2017-03-18 16:23","updateDate":"2017-04-07 18:00","code":"M1048","name":"库存盘点","remark":"库存盘点","sort":1038,"category":"成品仓仓管","alias":"库存盘点","domClass":"icon-stock_inventory","url":"","antMatcher":"","postTypes":null,"postTags":null,"modelTypes":null,"communion":false},{"id":356,"version":0,"createDate":"2017-03-22 16:01","updateDate":"2017-04-07 18:00","code":"M1078","name":"库存查询","remark":"库存查询","sort":1070,"category":"成品仓仓管","alias":"库存查询","domClass":"icon-stock_search","url":"","antMatcher":"","postTypes":null,"postTags":null,"modelTypes":null,"communion":false}]'),
                role:'',
                checkedData:''
            }
        },
        methods:{
            empower(){
                this.funCfg.show = true
            },
            getData(val){
                this.checkedData = val
            }
        }
    }
</script>
<template>
    <button class="btn-lg-imp" @click="empower">岗位授权</button>
    <refer-role-auth :config="funCfg" :data="data" @cb="getData" role-code="role"></refer-role-auth>
    <pre>
    props配置数据：
        config:{
            //参照是否显示  true|false
            show:false
        }

        //传递已选择的职能
        data:[]

        //需要岗位参考职能时，传递的岗位code
        role-code:'231'

    methods方法:

        //点击确定按钮后返回选中的数据
        @cb(val)

    返回数据:
    {{checkedData | json}}
    </pre>
</template>
<style lang="less">
    pre{
        height: 400px;
        overflow: auto;
        margin-top: 30px;
    }
</style>