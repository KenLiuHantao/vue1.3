<script type="text/javascript">
    /*
     * 配置使用注意事项
     * 1、props 不能修改
     * 2、operatingItem() 不能修改
     *
     */
    export default {
        props: ['index', 'current', 'data', 'config'],
        methods: {
            operatingItem(index) {
                this.current = index
            },
            operate(type) {
                if (type && typeof type == "function") {
                    type(this.data);
                } else {
                    this.$emit('cb', type, this.data)
                }
            }
        },
        computed: {
            computedButtons(){
                var buttons = this.config;
                buttons.forEach(function (button) {
                    if (!button.show) {
                        button.show = function () {
                            return true;
                        }
                    }
                });
                return buttons;
            }
        }
    }
</script>
<template>
    <template v-for="obj in computedButtons" >
        <a v-if="obj.show(data)" class='button-primary' @click.stop='operate(obj.btn)' href="javascript:;">{{ obj.text }}</a>
    </template>
</template>
<style lang='less' scoped>
    @import '../../../../public/css/variable.less';
    .blue{
        color: #008AF5;
    }
    .dot-group {
        display: flex;
        height: 14px;
        align-items: center;
        flex-direction: row;
        justify-content: center;
        cursor: pointer;
        &.ckd span {
            background-color: @link-color;
        }
        span {
            display: flex;
            width: 5px;
            height: 5px;
            margin-right: 3px;
            border-radius: 50%;
            background-color: #ADADAD;
        }
    }

    .more-group {
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: 14px;
        margin-left: -32px;
        width: 65px;
        z-index: 3;
        background-color: @body-bg;
        border: 1px solid @border-color;
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
            top: -11px;
            left: 50%;
            margin-left: -5px;
            display: inline-block;
            width: 0;
            border: 5px solid transparent;
            border-bottom-color: @border-color;
        }
        &:after {
            content: '';
            position: absolute;
            top: -10px;
            left: 50%;
            margin-left: -5px;
            display: inline-block;
            width: 0;
            border: 5px solid transparent;
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
