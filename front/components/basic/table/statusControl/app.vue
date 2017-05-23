<script>
export default {
    props: ['tabledata','config'],
    methods: {

    },
    data(){
        return {

        }
    },
    computed:{
        success(){
            return this.config.test(this.tabledata)
        },
        other () {
            if (this.config.other) {
                return this.config.other(this.tabledata)
            }
        },
    }

}
</script>
<template>
    <div class='status-div'>
        <span v-if='success === true' :style='config.successStyle' class='success'>{{config.success}}</span>
        <span v-if='success === false' :class="{'help': tabledata.errMsgs}" :style='config.failStyle' class='error'>{{config.fail}}</span>
        <div v-if='success === false && tabledata.errMsgs' class='errMsg'>
            <ul>
                <li v-for='item in tabledata.errMsgs'>{{item}}</li>
            </ul>
        </div>
        <span v-if='other' :style='config.otherStyle' class='other'>{{config.otherText}}</span>
    </div>
</template>
<style lang='less' scoped>
@import '../../../../public/css/variable.less';
.status-div:hover{
    .errMsg{
        display: inline-block;
    }
}
.error.help:hover{
    cursor: help;
}
.errMsg{
    position: absolute;
    display: none;
    top: 50%;
    left: 0;
    margin-top: 14px;
    margin-left: -25px;
    width: 100px;
    z-index: 3;
    background-color: #fff;
    border: 1px solid #F2F3F3;
    /*display: inline-block;*/
    white-space: normal;
    word-break: break-all;
    padding: 10px;
}
.errMsg:before{
    content: '';
    position: absolute;
    top: -11px;
    left: 50%;
    margin-left: -5px;
    display: inline-block;
    width: 0;
    border: 5px solid transparent;
    border-bottom-color: #F2F3F3;
}
.errMsg:after{
    content: '';
    position: absolute;
    top: -10px;
    left: 50%;
    margin-left: -5px;
    display: inline-block;
    width: 0;
    border: 5px solid transparent;
    border-bottom-color: #fff;
}
</style>
