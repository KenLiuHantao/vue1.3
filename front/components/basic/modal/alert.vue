<script>
/**
 * 弹出框
 * @params {object} config
 * {
 *   show:Boolean   控制弹框的控制状态(必要参数）
 *   quite:Boolean  是否显示取消按钮
 *   sure:Boolean   是否显示确认按钮
 *   cb:String      点击确认后会触发的事件名称
 *  }
 */
export default {
    props: {
        config: Object
    },
    data() {
        return {
            configs: {
                show: false,
                quite: true,
                sure: true,
                qname: '取消',
                sname: '确认',
                msg: '弹出框提示信息',
                subMsg: '',
                type: 'success',
                item: '',
                width: 298,
                sAutoClose: true,
                qAutoClose: true,
                title: '提示'
            }
        }
    },
    methods: {
        cb() {
            this.$emit('cb', this.configs.item || '');
            if (this.configs.sAutoClose) {
                this.config.show = false
            }
        },
        quite() {
            this.$emit('quite', this.configs.item || '');
            if (this.configs.qAutoClose) {
                this.config.show = false
            }
        },
        close(){
            this.$emit('close')
            this.config.show = false
        },
    },
    watch: {
        config: {
            handler(val, oldval) {
                for (let key in val) {
                    this.configs[key] = val[key]
                }
            },
            deep: true
        }
    }
}
</script>
<template>
    <div class="modal-mask modal-transition" v-show="configs.show" transition="modal">
        <div class="modal-area" :style="{'width':configs.width+'px'}">
            <div class="modal-header">
                {{configs.title}}
                <i @click='close' class="icon-modal__close close"></i>
            </div>
            <div class="modal-content">
                <slot>
                    <div class="item-icon" :class="config.tips || configs.type">
                        <span></span>
                    </div>
                    <div class="main">{{configs.msg}}</div>
                    <div class="sub" v-if="configs.subMsg">{{configs.subMsg}}</div>
                </slot>
            </div>
            <div class="modal-foot">
                <button class="btn-xl-def" v-if="configs.quite" @click='quite'>{{configs.qname}}</button>
                <button class="btn-xl-imp" v-if="configs.sure" @click="cb">{{configs.sname}}</button>
            </div>
        </div>
    </div>
</template>
<style lang='less' scoped>
@import '../../../public/css/variable.less';
.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    height: 46px;
    padding: 0 20px;
    background: #F4F7FD;
    color: #6c7a95;
    font-size: 16px;
    line-height: 46px;
    border-radius: 5px 5px 0 0;

    .close{
        cursor: pointer;
    }
}

.modal-mask,
.moimg-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.55);
    display: flex;
    justify-content: center;
    align-items: center;
    transition: opacity .3s ease;
}

.modal-area {
    position: relative;
    margin: 0 auto;
    background-color: @body-bg;
    border-radius: 8px;
    transition: all .3s ease;
    box-shadow: 0 0 3px rgba(0, 0, 0, .25);
    &.mb-58 {
        padding-bottom: 58px;
    }
}

.modal-head {
    position: relative;
    border-bottom: 1px solid #e8e8e8;
    margin-bottom: 20px;
}

.modal-content {
    padding: 10px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .item-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 10px;
        span {
            margin-right: 0;
            font-size: 36px;
        }
        &.success {
            color: #91d938;
            span:after {
                content: '\e97f';
            }
        }
        &.failure {
            color: #FE5A00;
            span:after {
                content: '\e980';
            }
        }
        &.warning {
            color: #FFB616;
            span:after {
                content: '\e981';
            }
        }
    }
    .main {
        line-height: 1.4;
        color: #000;
    }
    .sub {
        margin-top: 20px;
        color: #757575;
        line-height: 1.4;
        text-align: left;
        word-break: break-all;
    }
}

.modal-foot {
    padding: 0 0 20px 0;
    text-align: center;
}

.dialog-btn {
    height: 28px;
    line-height: 26px;
    margin-right: 6px;
    padding: 0 15px;
    border: 1px solid #becfe4;
    background-color: transparent;
    color: #333;
    border-radius: 2px;
    font-weight: 400;
    cursor: pointer;
    text-decoration: none;
    &:hover {
        opacity: .9;
        text-decoration: none;
        border-color: #017aff;
        color: #017aff;
    }
}

.modal-enter,
.modal-leave,
.moimg-enter,
.moimg-leave {
    opacity: 0;
}

.modal-enter .modal-area,
.modal-leave .modal-area,
.moimg-enter .moimg-area,
.moimg-leave .moimg-area {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
}
</style>
