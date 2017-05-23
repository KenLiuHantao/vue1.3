<script>
    export default {
        props: {
            cfg: Array,
        },
    }
</script>

<template>
    <div class="passwordLevel">
        <div v-for="item in cfg">
            <div :style="item.style" class="color"></div>
            <div :class="{ 'active': item.active }" class="text">{{ item.text }}</div>
        </div>
    </div>
</template>

<style lang="less" scoped>
    .passwordLevel {
        display: flex;

        > div {
            display: flex;
            flex-direction: column;
            align-items: center;

            &:nth-of-type(n+2) {
                margin-left: 5px;
            }
        }
    }

    .color {
        width: 56px;
        height: 4px;
    }

    .text {
        margin-top: 8px;
        color: #A4A4A4;
        font-size: 12px;

        &.active {
            color: #212121;
        }
    }
</style>