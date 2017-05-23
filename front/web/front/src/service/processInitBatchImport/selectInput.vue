<script>
    export default {
        props: {
            selectData: {
                type: Array,
                required: true
            },
            itemContent: {
                type: String,
                required: true
            }
        },
        data () {
            return {
                selectIsShow: false,
                inputItem: {},
                inputContent: '',
            }
        },
        methods: {
            selectOpen () {
                this.selectIsShow = !this.selectIsShow
            },
            choiceItem (item) {
                this.inputItem = Object.assign(item)
                this.inputContent = item[this.itemContent]
                this.selectIsShow = false
                this.emitItem()
            },
            emitItem () {
                this.inputItem[this.itemContent] = this.inputContent
                this.$emit('return-item', this.inputItem)
            }
        },
        ready () {
            document.addEventListener('click', () => {
                this.selectIsShow = false
            })
        },
    }
</script>

<template>
    <div class="si-container">
        <input @change="emitItem" v-model="inputContent" class="si-input" type="text">
        <div @click.stop="selectOpen" class="si-arrow-block">
            <i :class="{ 'active': this.selectIsShow }" class="si-arrow"></i>
        </div>
        <div v-show="selectIsShow" class="si-select">
            <div v-for="item in selectData" @click="choiceItem(item)" class="si-select-item">{{ item[itemContent] }}</div>
        </div>
    </div>
</template>

<style lang='less' scoped>
    .si-container {
        position: relative;
    }

    .si-arrow-block {
        position: absolute;
        top: 6px;
        right: 6px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 16px;
        height: 16px;
        cursor: pointer;
    }

    .si-arrow {
        display: inline-block;
        border-top: 6px solid black;
        border-left: 3px solid transparent;
        border-right: 3px solid transparent;
        transition: all .4s;

        &.active {
            transform: rotate(180deg);
        }
    }

    .si-select {
        position: absolute;
        top: 32px;
        left: 0;
        z-index: 1;
        width: 100%;
        min-height: 72px;
        max-height: 240px;
        background-color: #fff;
        border-radius: 2px;
        box-shadow: 0 2px 4px rgba(00, 00, 00, .5);
        overflow-y: auto;
    }

    .si-select-item {
        padding-left: 10px;
        line-height: 24px;
        cursor: pointer;

        &:hover {
            color: #03a9f4;
            background-color: #EBF7FD;
        }
    }
</style>
