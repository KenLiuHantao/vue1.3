<script type="text/javascript">
/*
 * config => Object 配置文件
 *  key => 辨识id
 *  width => 宽度
 *  maxlength => 最大长度
 *  placeHolder => same
 */

export default {
    props: {
        config: {
            type: Object,
            default () {
                return {
                    icon: 'icon-select',
                    placeHolder: '',
                    width: 'auto',
                    disabled: false,
                    isFirst: true,
                    maxlength:120
                }
            }
        },
        data: {
            default () {
                return ''
            }
        }
    },
    watch: {
        data(val, old) {
            this.$emit('cb', this.data)
        }
    },
    methods: {
        clear() {
            this.$emit('clear')
        },
        modal() {
            this.$emit('modal')
        },
        getVal() {
            this.$emit('cb', this.data)
        },
        focus() {
            this.$emit('foc')
            this.getVal()
        },
        blur() {
            this.$emit('blu')
        }
    },
    computed: {
        sInputStyle() {
            return {
                width: this.config.width
            }
        },
        place() {
            return this.config.placeHolder
        },
        read() {
            return this.config.disabled
        },
        iconGroup() {
            let arr = ['r1']
            arr.push(this.config.icon)
            return arr
        }
    }
}
</script>
<template>
    <div class="s-input"  :style='sInputStyle'>
        <input :maxlength='config.maxlength' class="pr-56" @click.stop="" :placeholder='place' :disabled='read' type='text' v-model='data' @focus='focus' @blur='blur'>
        <i @click.stop='clear' class="r2 icon-close__round" v-show="data != ''"></i>
        <i @click='modal' class="r1 icon icon-search"></i>
        <slot></slot>
    </div>
</template>
<style lang='less' scoped>
@import '../../../public/css/variable.less';
.pr-56{
    padding-right: 56px!important;
}
</style>
