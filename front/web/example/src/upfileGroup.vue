<script>
import ug from 'nb/uploadGroup/app'
export default {
    components:{
        ug
    },
    data(){
        return {
           uCfg:{
                limit:5,
           },
           isEdit:false,
           upData:[]
        }
    },
    methods:{
        e(){
            this.isEdit = !this.isEdit
        }
    },
    watch:{
        upData:{
            handler(val){
                console.log(val)
            },
            deep:true
        }
    }
}
</script>
<template>
    <button class="btn-xl-imp" @click="e">状态切换</button>
    <br />
    <ug :config ='uCfg' :edit="isEdit" :data="upData"></ug>
    <pre>
    config配置:
    {
       //限制数量,默认6  选填
       limit:5,

       //限制大小  选填
       size: 1024 * 1024 * 10,

       //限制类型  选填
       extensions: 'zip',

       //图片上传地址  选填
       url: '',
   }

   //显示与编辑状态切换   必填
   edit:true,

   数据(双向绑定):  必填
        data:已上传或不前上传的数据
   </pre>
</template>
<style lang="less" scoped>
    pre{
        margin: 10px;
        padding: 10px;
        border-left: 2px solid cadetblue;
        overflow: auto;
    }
</style>
