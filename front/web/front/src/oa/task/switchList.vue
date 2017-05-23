<template>
    <div class="switch-list">
        <ul class="switch">
            <li v-for="(index, item) in cfg.switchCfg" @click="activeSwitch(index)" :class="item.klass">{{ item.text }}</li>
        </ul>
        <ul class="list">
            <li v-for="item in listCfgData">
                <div v-for="value in item">{{ value }}</div>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        props: {
           cfg: {
               type: Object,
           },
        },
        data () {
            return {
            }
        },
        computed: {
            listCfgData () {
                let matchArr = this.cfg.listCfg.match
                let originData = this.cfg.listCfg.data
                let resultData = originData.map(oldObj => {
                    let newObj = {}
                    matchArr.forEach(val => {
                        if (val instanceof Object) {
                            let key = Object.keys(val)[0]
                            newObj[key] = val[key](oldObj)
                        } else {
                            newObj[val] = oldObj[val]
                        }
                    })
                    return newObj
                })
                return resultData
            },
        },
        methods: {
            activeSwitch (i) {
                this.cfg.switchCfg.forEach((value) => {
                    value.klass.active = false
                })
                this.cfg.switchCfg[i].klass.active = true

                let state = this.cfg.switchCfg[i].state
                this.$emit('cb', state)
            },
        },
    }
</script>

<style lang="less" scoped>
    .switch {
        display: flex;

        li {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 50px;
            border-bottom: 1px solid #F2F3F3;
            font-size: 16px;
            cursor: pointer;

            &.active {
                position: relative;
                color: #03a8f4;
                &::after {
                    content: "";
                    position: absolute;
                    left: 0;
                    bottom: -1px;
                    width: 100%;
                    height: 2px;
                    background-color: #03a8f4;
                }
            }
        }
    }

    .list {

        li {
            display: flex;
            justify-content: space-around;
            align-items: center;
            height: 50px;
            padding: 0 50px;
            border-bottom: 1px solid #F2F3F3;

            div {
                flex: 1;

                &:nth-of-type(n+2) {
                    color: #757575;
                }
            }
        }
    }
</style>