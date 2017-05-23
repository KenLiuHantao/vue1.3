<script>
/*
 * 配置使用注意事项
 * 1、props 不能修改
 * 2、operatingItem() 不能修改
 * type 0 人事档案
 * type 1 人事批量导入
 */
export default {
    props: ['index', 'current', 'data', 'config'],
    methods: {
        operatingItem(index) {
            this.current = index
        },
        operate(type) {
            this.$emit('cb', type, this.data)
        }
    }
}
</script>
<template>
    <div class="opt-wrap">
        <div class="more-group">
            <a class='blue' @click.stop='operate(0)' href="javascript:;">编辑</a>
            <a class='danger' @click.stop='operate(1)' href="javascript:;">重置密码</a>
            <!-- <a class='normal' @click.stop='operate(2)' href="javascript:;">离职</a> -->
        </div>
        <div class='dot-group more' @click.stop='operatingItem(index)'>
            <span></span><span></span><span></span>
        </div>
    </div>
</template>
<style lang='less' scoped>
@import '../../../../public/css/variable.less';
    .table-list tbody tr:hover .dot-group {
        background: rgba(255,255,255,0.5);
        border: 1px solid #d4d4d4;
    }

    .opt-wrap{
        position: relative;
        display: inline-block;
    }
    .opt-wrap:hover  .more-group{
        display: block;
    }
    .dot-group {
        display: flex;
        width: 46px;
        height: 28px;
        align-items: center;
        flex-direction: row;
        justify-content: center;
        cursor: pointer;
        border-radius: 4px;
        &:hover span {
            background-color: @link-color;
        }
        &:hover{
            border: 1px solid #87DAFF !important;
            background: rgba(255,255,255,0.5);
        }
        span {
            display: flex;
            width: 5px;
            height: 5px;
            margin-right: 3px;
            border-radius: 50%;
            background-color: #ADADAD;
        }
        a{
            color: #03a9f4;
        }
    }

    .more-group {
        position: absolute;
        display: none;
        top: 40%;
        left: 14px;
        padding: 4px 0;
        margin-top: 14px;
        margin-left: -32px;
        width: 85px;
        z-index: 3;
        background-color: @body-bg;
        border: 1px solid @border-color;
        box-shadow: 0 1px 2px #F2F3F3;
        &:hover + .dot-group {
            background: rgba(255,255,255,0.5);
            border: 1px solid #87DAFF !important;

            span {
                background-color: @link-color;
            }
        }
        a {
            display: block;
            text-align: center;
            font-size: 12px;
            padding: 5px 0;
            height: 25px;
            box-sizing: border-box;
            &:hover {
                background-color: #EBF7FD;
            }
        }
        &:before {
            content: '';
            position: absolute;
            top: -17px;
            left: calc(~"50% - 4px");
            margin-left: -5px;
            display: inline-block;
            width: 0;
            border: 8px solid transparent;
            border-bottom-color: @border-color;
        }
        &:after {
            content: '';
            position: absolute;
            top: -16px;
            left: calc(~"50% - 4px");
            margin-left: -5px;
            display: inline-block;
            width: 0;
            border: 8px solid transparent;
            border-bottom-color: @body-bg;
        }
        .blue {
            color: #008AF5;
        }
        .danger {
            color: #FF0700;
        }
        .normal {
            color: #757575;
        }
    }
</style>
