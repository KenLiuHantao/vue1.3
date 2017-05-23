<script type="text/javascript">
    import item from './list_item.js'

    export default {
        components: {
            item
        },
        data() {
            return {
                isMain: true
            }
        },
        props: {
            config: Object,
            data: Array,
            entity: Object,
            oid: String
        },
        methods: {
            getItem(item, obj) {
                this.$emit('cb', item, obj)
            }
        }
    }
</script>
<template>
    <div class="list_item">
        <ul class="box">
            <template v-for='(index , list) in data'>
                <item :config='config' :model='list' :entity='entity' :uid.sync='oid' :main='isMain' :nub='index' @cb='getItem'></item>
            </template>
        </ul>
    </div>
</template>
<style lang='less'>
    @import '../../../public/css/variable.less';
    .list_item {
        position: absolute;
        top: 52px;
        width: 100%;
        left: 0;
        bottom: 0;
        overflow-y: scroll;
        .box {
            height: auto;
            >li {
                position: relative;
                padding: 13px 7px 12px 40px;
                border-bottom: 1px solid @border-color;
                cursor: pointer;
                min-height: 46px;
                box-sizing: border-box;
                &:after {
                    position: absolute;
                    display: flex;
                    width: 30px;
                    height: 30px;
                    left: 0;
                    top: 8px;
                    color: @gray-sub;
                    align-items: center;
                    justify-content: center;
                    transform: rotate(-90deg);
                    transition: all .1s;
                }
                &.first:after {
                    content: '\e926';
                }
                /* 层级点击效果 */
                &:hover{
                    background-color: #F0F9FD;
                }
                &.open {
                    p, span {
                        color: @link-hover !important;
                    }
                    &:after {
                        color: @link-hover;
                        transform: rotate(0deg) !important;
                    }
                }
                &.ckd {
                    color: @link-color;

                    .nub{
                        border-color: @link-color;
                    }
                    & {
                        background: @list-hover;
                        p, span {
                            color: @link-hover;
                        }
                        &:after {
                            color: @link-color;
                            display: block;
                            content: '';
                            width: 2px;
                            height: 100%;
                            left: 0;
                            top: 0;
                            background-color: @link-hover;
                            transform: rotate(0deg);
                        }
                    }
                    &.first {
                        background: #fff;
                        /*p, span {
                            color: #212121;
                        }*/
                        &:after {
                            content: '\E926';
                            position: absolute;
                            top: 8px;
                            left: 0;
                            display: flex;
                            width: 30px;
                            height: 30px;
                            background-color: #fff;
                            transform: rotate(-90deg);
                        }
                        &:before{
                            color: #008af5;
                            display: block;
                            content: '';
                            width: 2px;
                            height: 100%;
                            left: 0;
                            top: 0;
                            background-color: #03a9f4;
                            -webkit-transform: rotate(0deg);
                            transform: rotate(0deg);
                            position: absolute;
                            z-index: 1;
                        }
                    }
                    /* 层级点击效果 end */
                }
                .nub {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-width: 16px;
                    height: 16px;
                    padding: 0 2px;
                    border-radius: 2px;
                    margin-right: 5px;
                    font-size: @font-size-small;
                    transform: scale(0.8);
                    border: 1px solid @main-text;
                }
                .title {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    span {
                        font-size: 14px;
                        font-weight: normal;
                        line-height: 18px;
                    }

                    &.sub-title{
                        flex-direction: column;
                        align-items: flex-start;
                        margin-top: 5px;
                        .nub{
                            color: transparent;
                            border-color: transparent;
                        }
                        .sub-font{
                            font-size: 12px;
                            color: @gray-sub;
                        }
                    }
                }
                .seriel{
                    display: flex;
                    align-items: center;

                    .sub{
                        font-size: 12px!important;
                        color: @gray-sub;
                    }
                }
                p {
                    color: @sub-text;
                    font-size: @font-size-small;
                    margin-top: 12px;
                }
            }
            &.sub {
                background-color: @gray-dark;

                >li{
                    padding-left: 50px;
                    position: relative;
                    &:hover{
                        background-color: @list-hover;
                    }
                }
            }
        }
    }
</style>
