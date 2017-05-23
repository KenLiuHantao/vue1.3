<script>
export default {
    data() {
        return {
            windows: {}
        }
    },
    ready: function() {

    },
    methods: {
        open: function(url, params) {
            params = params || {};
            if (typeof params == "string") {
                params = {
                    name: params
                };
            }
            if (typeof params == "function") {
                params = {
                    onclose: params
                };
            }
            var openedWindow;
            if (params.name) {
                openedWindow = window.open(url, params.name);
                this.windows[params.name] = openedWindow;
            } else {
                openedWindow = window.open(url);
            }
            openedWindow.onbeforeunload = function(event) {
                (params.onclose || function(event) {})(event);
            }
        },
        close: function(name) {
            var w = this.windows[name];
            if (w) {
                w.close();
            };
        },
        reload: function(name) {
            var w = this.windows[name];
            if (w) {
                w.location.reload();
            };
        }
    }
}
</script>
<template>
        <h2>window open</h2>
        <br>
        <input type="button" value="打开一个匿名窗口" @click="open('http://www.qq.com')" />
        <input type="button" value="打开一个窗口A" @click="open('/#!/windowOpen','A')" />
        <input type="button" value="关闭窗口A" @click="close('A')" />
        <input type="button" value="刷新窗口A" @click="reload('A')" />
</template>
