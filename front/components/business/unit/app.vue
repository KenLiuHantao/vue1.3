<script type="text/javascript">
export default {
    props: ['data'],
    ready() {
        window.addEventListener('click', () => {
            this.edit = false
        })
    },
    data() {
        return {
            wareParam: {
                "unitCode": "",
                "unitName": "",
                "unitShortName": ""
            },
            wareData: [],
            edit: false
        }
    },
    methods: {
        flitWare() {
            this.edit = true
            this.wareParam.unitName = this.data
            this.getWare()
        },
        getItem(obj) {
            this.data = obj.unitName
            this.$emit('cb', obj)
            this.edit = false
        },
        getWare() {
            this.edit = true
            this.$http.post(__URL.arc + 'unit/find/ref', this.wareParam).then(
                (res) => {
                    this.wareData = res.data.data.dataList
                }
            )
        }
    }
}
</script>
<template>
    <div class="s-input">
        <input @input='flitWare' type="text" v-model='data'>
        <i class="icon-select_caret icon" @click.stop='getWare'></i>
        <ul v-show='edit' class="filtCount">
            <li v-for='item in wareData' @click.stop='getItem(item)'>{{item.unitName}}</li>
            <li v-if='wareData.length == 0'>暂无数据</li>
        </ul>
    </div>
</template>
<style lang='less' scoped>
@import '../../../public/css/variable.less';
.icon-select_caret{
    position: absolute;
    right: 0;
    top: 8px;
    transform: scale(0.6);
}
.filtCount {
    position: absolute;
    width: 100%;
    z-index: 9999;
    max-height: 240px;
    overflow-y: scroll;
    border: 1px solid @border-color;
    background-color: @body-bg;
    li {
        display: flex;
        align-items: center;
        height: 28px;
        padding: 0 10px;
        font-size: 12px;
        cursor: pointer;
        &:hover {
            background-color: @list-hover;
        }
    }
}
</style>
