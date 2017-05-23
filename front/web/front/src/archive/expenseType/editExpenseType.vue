<script>
    import cfg from './cfg'
    export default {
        props: [
            "detail",
            "code",
        ],
        data() {
            return {
                msgConfig: {
                    show: false,
                    content: '提交成功',
                    type: 'success'
                },
                tableData:{},
            }
        },
        methods: {
            sure(){
                this.$http.post(__URL.arc + 'expensetype/update', this.tableData).then(
                    (res) => {
                        if (res.data.success) {
                            this.close();
                            this.$emit('refresh', 'success', "修改成功！");
                        } else {
                            this.setWarningSuccess('failure', res.data.errMsg)
                        }
                    }
                )
            },

            setWarningSuccess(type, data){
                this.msgConfig.show = true
                this.msgConfig.content = data
                this.msgConfig.type = type
            },

            close(){//关闭
                this.newBank = {};
                this.detail.show = false;
            }
        },
        ready(){
        },
        watch:{
            code:{
                handler(val,oldVal){

                    //查询记录code
                    this.$http.get(__URL.arc + 'expensetype/find/'+this.code).then(
                        res => {
                            if (res.data.success) {
                                this.tableData = res.data.data.dataList[0];
                            }else{
                                this.setWarningSuccess('failure',res.data.errMsg);
                            }
                        }
                    );
                },
                deep:true
            }
        }
    }


</script>
<template>
    <modal :config="detail" @sure='sure' @close='close' @quite="close">

        <div class="form-group wd-100">
            <label>费用类型:</label>
            <span>{{tableData.expenseCategoryName}}</span>
        </div>

        <div class="form-group wd-100">
            <label>费用类别:</label>
            <span>{{tableData.expenseTypeName}}</span>
        </div>

        <div class="form-group wd-100">
            <label>描述:</label>
            <input type="text" maxlength="256"  v-model="tableData.remark">
        </div>
    </modal>

    <warning :config="msgConfig"></warning>
</template>
<style lang='less' scoped>
    @import '../../../../../public/css/variable.less';
</style>