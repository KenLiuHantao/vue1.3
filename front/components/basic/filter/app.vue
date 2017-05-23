<script>
import date from 'nc/calendar/app'
export default {
    components:{
        date
    },
    data() {
        return {
           
        }
    },
    props: ['config'],
    ready() {

    },
    methods: {
        clear:function(key){
            for(var i=0;i<this.config.length;i++){
                if(this.config[i].key==key){
                    this.config[i].value=''
                }
            }
        },
        getEmit:function(emit){
            this.$emit('cb',emit)
        }
    }
}
</script>
<template>
    <div class="pd-10 filter_body">
        <div class='searchGroup' v-for='(index,item) in config'>
            <label>{{item.label}}</label>
            <input type='text' v-if='item.type=="text"' v-model='item.value' :placeholder='item.placeholder'>
            <template v-if='item.type=="date"'>
                <date :config="item.config" :date.sync='item.value'></date>
            </template>
            <template v-if='item.type=="search"'>
                <div class="s-input ic2">
                    <input :placeholder='item.placeholder'  disabled type="text" v-model='item.value'>
                    <i @click='clear(item.key)' v-show='item.value' class="icon-close__round r2" ></i>
                    <i @click='getEmit(item.emit)' class="icon-search r1"></i>
                </div>
            </template>
            <template v-if='item.type=="select"'>
                <select v-model='item.value'>
                    <option :value='op' v-for='op in item.option'>{{op}}</option>
                </select>
            </template>     
        </div>
        <!-- <button @click='test'>123</button> -->
    </div>
</template>
<style lang='less' scoped>
@import '../../../public/css/variable.less';
.pd-10 {
    padding: 10px;
}
.filter_body{
    max-height: 400px;
    overflow: auto;
}
.searchGroup {
    position: relative;
    min-height: 28px;
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 5px;
    font-size: 12px;
    .s-input{
        width: 100%;
    }
    >label {
        width: 100%;
        font-size: @font-size-small;
        text-align: left;
        line-height: 28px;
        .must-point {
            color: @danger;
            font-size: @font-size-small;
            margin-right: 5px;
        }
    }
    input[type=text]{
        display: inline-block;
        width: 100%;
        height: 28px;
        line-height: 1.2;
        padding: 5px 10px;
        border: 1px solid #dbe5ea;
        border-radius: 2px;
        vertical-align: top;
        -moz-appearance: textfield;
        background-color: #fff;
    }
    select{
        width: 100%;
    }
    .date-container{
        width: 100%;
    }
}
</style>
