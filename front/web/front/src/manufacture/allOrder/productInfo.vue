<script>
export default {
    components:{
    },
    data() {
        return {
            departmentCfg:{
                show:false,
                data:{}
            },
            roleSelectConfig: {
                departmentCode: null,
                show: false,
                selectedRoles:[]
            },
        }
    },
    props: ['detail'],
    ready() {

    },
    methods: {

    },
    computed:{
        newDetail:function(){
            return this.detail
        }
    }
}
</script>
<template>
    <div class="pd-10">
        <div class='form-group'>
            <label>待排产数量:</label>
            <div class="s-input ic2">
                 {{newDetail.waitProductQuantity}}
            </div> 
        </div>    
        <div class='form-group'>
            <label>齐料数量:</label>
            <div class="s-input ic2">
                {{newDetail.readyQuantity}}
            </div> 
        </div> 

        <div class='form-group'>
            <label>下达数量:</label>
            <div class="s-input ic2">
                <input-number  class="wd100"  :code.sync ="newDetail.sureProductQuantity" ></input-number>
            </div>
        </div>
    </div>
</template>
<style lang='less' scoped>
@import '../../../../../public/css/variable.less';
.pd-10 {
    padding: 10px;
}
.filter_body{
    max-height: 400px;
    overflow: auto;
}
</style>
