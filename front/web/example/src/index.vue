<script>
import sidebar from 'nc/frame/sidebar'
import cfg from '../routes/cfg'
export default {
    data() {
            return {
                tabData: [],
                cfg: cfg
            }
        },
        components: {
            sidebar,
        },
        ready() {
            this.cfg.forEach(item => {
                this.tabData.push(item)
            })
        }
}
</script>
<template>
    <sidebar></sidebar>
    <container>
        <div class="pd-10">
            <h4 class="tab-nav">
                <a  v-for='item in tabData'
                    v-link="{ path:'/i/'+item.key }">
                    {{item.title}}
                </a>
            </h4>
        </div>
        <div class="show-wrap">
            <router-view></router-view>
        </div>
    </container>
</template>
<style lang='less' scoped>
@import '../../../public/css/common.less';
.pd-10 {
    padding: 10px;
}
.show-wrap{
    padding-left: 20px;
}
.tab-nav {
    border-bottom: 1px solid @border-color;
    margin-bottom: 10px;
    display: flex;
    width: 100%;
    flex-direction: row;
    flex-wrap: wrap;
    a {
        display: flex;
        padding: 15px;
        text-align: center;
        font-size: 14px;
        color: @main-text;
        margin-bottom: -1px;
        border-bottom: 1px solid transparent;
        &.v-link-active {
            color: @link-color;
            border-bottom: 1px solid @link-color;
            border-color: @link-color;
        }
    }
}
</style>
