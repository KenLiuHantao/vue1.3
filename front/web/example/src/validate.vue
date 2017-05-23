<script>
export default {
    data() {
        return {
            test1: ['', {reg: /^1[0-9]{10}$/ }],
            test2: ['', {reg: /^1[0-4]{10}$/ }],
        }
    }
}
</script>
<template>
    <div class="vGroup">
        <input type='text' v-va:fir='test1[0]' tag='测试1' v-model='test1[0]'>
        <input type='text' v-va:sc='test2[1]' tag='测试2' v-model='test2[0]'>
    </div>
</template>
