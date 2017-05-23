<script>
    export default {
        props: {
            tableData: {
                type: Array,
            }
        },
        data() {
            return {
            }
        },
    }
</script>

<template>
    <table class="approvalTable">
        <thead>
            <th width="70%">批注</th>
            <th width="8%">操作人</th>
            <th width="14%">操作时间</th>
            <th width="8%">处理结果</th>
        </thead>
        <tbody>
            <tr v-for="item in tableData">
                <td><p>•&nbsp;{{ item.reason }}</p></td>
                <td><p>{{ item.userName }}</p></td>
                <td><p>{{ item.createTime }}</p></td>
                <td><p>{{ item.statusDesc }}</p></td>
            </tr>
        </tbody>
    </table>
</template>

<style lang='less' scoped>
    .approvalTable {
        width: 100%;
        font-size: 12px;
        text-align: left;

        th {
            height: 40px;
            border-top: 1px solid #E1E6E9;
            border-bottom: 1px solid #E1E6E9;
            color: #000000;

            &:first-of-type {
                padding-left: 25px;
                border-left: 1px solid #E1E6E9;
            }

            &:last-of-type {
                border-right: 1px solid #E1E6E9;
            }
        }

        tbody tr {

            &:nth-last-of-type(n+2) {
                border-bottom: 1px dashed #E1E6E9;
            }

            &:last-of-type {
                border-bottom: 1px solid #E1E6E9;
            }
        }

        td {
            height: 60px;

            &:first-of-type {
                padding-left: 25px;
                border-left: 1px solid #E1E6E9;
            }

            &:last-of-type {
                border-right: 1px solid #E1E6E9;
            }

            &:nth-of-type(2),
            &:nth-of-type(3) {
                color: #757575;
            }

            p {
                word-break: break-all;
            }
        }
    }
</style>
