<script>
/**
 * 弹出框
 * @params {object} config
 * {
 *   show:Boolean   控制弹框的控制状态(必要参数）
 *   showtime:number      打开后消失的延迟(毫秒)
 *   msg:string  提示的消息
 *  }
 */
export default {
    data() {
            return {
                Show: false,
                showTime: 1000
            }
        },
        ready() {
            if (this.config.showtime) {
                this.showTime = this.config.showtime
            }
        },
        watch: {
            config: {
                handler(val, oldval) {
                    if (this.config.show) {
                        this.Show = true;
                        var that = this;

                        function refresh(that) {
                            that.config.show = false;
                            that.Show = false;
                        }
                        setTimeout(function() {
                            refresh(that)
                        }, this.showTime)
                    }
                },
                deep: true
            }
        },
        methods: {
            refresh() {
                this.$emit('refreshmsg');
                this.config.show = false
            }
        },
        props: ['config']
}
</script>
<template>
    <div v-show='Show' class='msg'>
        {{config.content}}
    </div>
</template>
<style lang='less' scoped>
@import '../../../public/css/variable.less';
.msg {
    display: inline-block;
    padding: 0 10px;
    min-width: 100px;
    min-height: 40px;
    line-height: 40px;
    background-color: rgba(0, 0, 0, .6);
    color: #fff;
    border: none;
    border-radius: 2px;
    text-align: center;
    margin: auto;
    position: fixed;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    z-index: 10086;
}
</style>
