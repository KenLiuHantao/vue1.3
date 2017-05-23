<script>
    import cfg from './cfg'
    export default {
        props: [
            "detail",
            "selectedobj",
        ],
        data() {
            return {
                msgConfig: {
                    show: false,
                    content: '提交成功',
                    type: 'success'
                },
                tableData:{},
                allIndustryCategory:[],
                allDepreciation:[],
            }
        },
        methods: {
            sure(){
                for(var i = 0;i<this.allIndustryCategory.length;i++){
                    if(this.tableData.industryCategoryCode ==this.allIndustryCategory[i].industryCategoryCode) {
                        this.tableData.industryCategoryName = this.allIndustryCategory[i].industryCategoryName;
                    }
                }
                for(var i = 0;i<this.allDepreciation.length;i++){
                    if(this.tableData.depreciationMethodCode ==this.allDepreciation[i].depreciationMethodCode) {
                        this.tableData.depreciationMethodName = this.allDepreciation[i].depreciationMethodName;
                    }
                }
                this.$http.post(__URL.arc + 'assetstype/insert', this.tableData).then(
                    (res) => {
                        if (res.data.success) {
                            this.close();
                            this.$emit('refresh', 'success', "新增成功！");
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

            //行业分类
            this.$http.get(__URL.arc + 'industry/category/first').then(
                (res) => {
                    if (res.data.success) {
                        var d = res.data.data;
                        this.tableData.industryCategoryCode =d[0].industryCategoryCode;
                        this.tableData.industryCategoryName =d[0].industryCategoryName;
                        for (var i = 0; i < d.length; i++) {
                            this.allIndustryCategory.push(d[i]);
                            this.$http.get(__URL.arc + 'industry/category/second/'+d[i].industryCategoryCode).then(
                                res2 =>{
                                    if (res2.data.success) {
                                        var d2 = res2.data.data;
                                        for (var j = 0; j < d2.length; j++) {
                                            this.allIndustryCategory.push(d2[j]);
                                        }
                                    }
                                }
                            );
                        }
                    }
                },
                (err) => {
                    console.log('初始化未能拿到银行数据')
                }
            );

            this.$http.post(__URL.arc + '/depreciationmethod/findallinfo', {}).then(
                (res) => {
                    if (res.data.success) {
                        this.allDepreciation=[];
                        this.tableData.depreciationMethodCode = res.data.data.dataList[0].depreciationMethodCode;
                        this.tableData.depreciationMethodName = res.data.data.dataList[0].depreciationMethodName;
                        for(var i = 0; i<res.data.data.dataList.length;i++) {
                            this.allDepreciation.push(res.data.data.dataList[i]);
                        }
                    }else{
                        this.setWarningSuccess('failure', res.data.errMsg)
                    }
                },
                (err) => {
                    console.log('初始化未能拿到折旧数据')
                }
            );
        },
        watch:{
            selectedobj:{
                handler(val,oldVal){
                    this.tableData.assetsCategoryName = val.assetsCategoryName;
                    this.tableData.assetsCategoryCode = val.assetsCategoryCode;
                },
                deep:true
            }
        }
    }


</script>
<template>
    <modal :config="detail" @sure='sure' @close='close' @quite="close">

        <div class="form-group wd-100">
            <label>资产类型:</label>
            <span>{{tableData.assetsCategoryName}}</span>
        </div>

        <div class="form-group wd-100">
            <label>资产类别:</label>
            <input v-model="tableData.assetsType" maxlength="32" placeholder="请输入" type="text">
        </div>

        <div class="form-group wd-100">
            <label>是否包含进项税:</label>
            <input type="radio" name="inputTax" value="1" v-model="tableData.containInputTax">包含
            <input type="radio" name="inputTax" value="0" v-model="tableData.containInputTax" checked="checked">不包含
        </div>

        <div class="form-group wd-100">
            <label>行业分类:</label>
            <select v-model='tableData.industryCategoryCode'>
                <option :value='item.industryCategoryCode' v-for='item in allIndustryCategory'>{{item.industryCategoryName}}</option>
            </select>
        </div>

        <div class="form-group wd-100">
            <label>折旧方法:</label>

            <select v-model='tableData.depreciationMethodCode'>
                <option :value='item.depreciationMethodCode' v-for='item in allDepreciation'>{{item.depreciationMethodName}}</option>
            </select>
        </div>
    </modal>

    <warning :config="msgConfig"></warning>
</template>
<style lang='less' scoped>
    @import '../../../../../public/css/variable.less';
</style>