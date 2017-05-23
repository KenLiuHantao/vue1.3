<script>
    /*
     title:选择币种

     配置:
     config:{
     show:false, //弹框显示 true|false 必填
     },

     回调：
     cb(val)

     */
    export default {
        props:['config'],
        data(){
            return {
                leftList:[
                ],
                rightList:[
                ],
                leftcheckbox:[]
            }
        },
        ready(){
            this.$http.post(__URL.arc + 'currency/remote').then(
                (res) => {
                    this.leftList = res.data.data
                }
            )
            this.$http.post(__URL.arc + 'currency/local').then(
                (res) => {
                    this.rightList = res.data.data
                    for(var i=0;i<this.rightList.length;i++){
                        this.leftcheckbox.push(this.rightList[i].currencyCode);
                    }
                }
            )
            if(this.leftcheckbox.length!=0){
                this.changeLeft()
            }
        },
        methods:{
            changeLeft(){
                this.rightList=[];
                for(let i=0;i<this.leftList.length;i++){
                    for(let j=0;j<this.leftcheckbox.length;j++){
                        if(this.leftcheckbox[j]===this.leftList[i].currencyCode){
                            this.rightList.push(this.leftList[i])
                        }
                    }
                }
            },
            deleteRight(currencyCode){
                for(let i=0;i<this.rightList.length;i++){
                    if(this.rightList[i].currencyCode==currencyCode){
                        this.rightList.splice(i,1)
                    }
                }
                for(let i=0;i<this.leftcheckbox.length;i++){
                    if(this.leftcheckbox[i]==currencyCode){
                        this.leftcheckbox.splice(i,1)
                    }
                }
            },
            cancel(){
                this.config.show=false;
            },
            sure(){
                this.config.show=false;
                this.$emit('cb',this.rightList)
            }
        }
    }
</script>
<template>
    <modal :config='config' @codeclose='cancel' @codesure='sure'>
        <div class='left_div'>
            <h2>未选币种</h2>
            <ul>
                <li v-for='item in leftList'>
                    <input type='checkbox'  @change='changeLeft' :value='item.currencyCode' v-model='leftcheckbox'>
                    {{item.currencyName}}
                    <span class='right_text'>{{item.currencySymbol}}</span>
                </li>
            </ul>
        </div>
        <div class='right_div'>
            <h2>已选币种</h2>
            <ul>
                <li v-for='item in rightList'>
                    <span class="must-point">*</span>
                    {{item.currencyName}}
                    <span class='right_text'>{{item.currencySymbol}}
                        <i class='icon-delete' @click='deleteRight(item.currencyCode)'></i>
                    </span>
                </li>
            </ul>
        </div>
    </modal>   
</template>
<style lang="less" scoped>
    @div-padding: 24px;

    .left_div{
        display: inline-block;
        font-size: 0;
        width: 350px;
        height: 390px;
        border: 1px solid #F2F3F3;
        border-left: none;
        overflow: auto;
        padding: @div-padding;
        li{
            height: 28px;
            margin-bottom: 6px;
            font-size: 12px;
            line-height: 28px;
            input[type='checkbox']{
                top: 2px;
                margin-right: 6px;
                vertical-align: top;
            }
            .right_text{
                float: right;
                line-height: 28px;
            }
        }
    }
    .right_div{
        float: right;
        display: inline-block;
        font-size: 0;
        width: 350px;
        height: 390px;
        border: 1px solid #F2F3F3;
        border-left: none;
        border-right: none;
        overflow: auto;
        padding: @div-padding;
        li{
            height: 28px;
            margin-bottom: 6px;
            font-size: 12px;
            line-height: 28px;
            input[type='checkbox']{
                vertical-align: top;
            }
            .right_text{
                float: right;
                line-height: 28px;
            }
            i{
                margin-left: 4px;
                vertical-align: inherit;
                cursor: pointer;
            }
        }
    }
    h2{
        font-size: 12px;
        font-weight: normal;
        color:#757575;
        margin-bottom: 15px;
    }
</style>

