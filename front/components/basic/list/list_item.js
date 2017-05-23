import Vue from 'vue'
export default Vue.extend({
    name: 'sublist',
    template: '    <li  :class="{\'ckd\':ckd,\'first\':isMain,\'open\':isOpen && open}" @click="getSub">' +
        '       <div class="title">' +
        '           <div class="seriel">'+
        '               <span v-if="!main && hasNub" class="nub">{{nub}}</span>' +
        '               <span>{{model | title}}</span>' +
        '           </div>' +
        '           <span>{{model | right}}</span>' +
        '       </div>' +
        '       <template v-if="hasSub">' +
        '       <div class="title sub-title" > ' +
        '            <div class="seriel" v-for="su in sub">' +
        '               <span class="nub">{{nub}}</span><span class="sub-font">{{model | subWords su}}</span>' +
        '           </div> ' +
        '       </div>' +
        '       </template>' +
        '    </li>' +
        '    <template v-if="hasChild">' +
        '        <ul class="box sub" v-show="uid == model[ownEntity.key]">' +
        '           <sublist @cb="getLastItem" v-for="li in subData" :model="li" :entity="subEntity" :uid.sync="subUid" :config="config" :main="subMain" :nub="$index+1"></sublist>' +
        '        </ul>' +
        '    </template>',
    props: ['model', 'entity', 'uid', 'config', 'main', 'nub'],
    data() {
        return {
            open: false,
            ckd:false,
            subData: [],
            subEntity: {},
            subUid: '',
            subMain: false,
            initParam: {}
        }
    },
    ready() {
        if (this.hasChild) {
            if (this.main) {
                this.initParam = Object.assign({}, this.entity.sub.param)
            } else {
                this.initParam = Object.assign({}, this.entity.param)
            }
        } else {
            this.initParam = Object.assign({}, this.entity.main.param)
        }
        if (this.nub == 0){
            this.open = true
            this.ckd = true
        }
    },
    methods: {
        check() {
            const that = this;
            const c = this.$parent.$children;
            this.$parent.ckd= false
            c.forEach((item, index)=> {
                if (c[index] !== that) {
                    c[index].resetAll()
                } else {
                    this.resetAll()
                    that.open = true
                    that.ckd = true
                }
            })
        },
        resetAll() {
            this.open = false;
            this.ckd = false;
            if (this.$children && this.$children.length) {
                this.$children.forEach(function(item) {
                    item.resetAll();
                })
            }
        },

        /* 公用方法 */
        copyObj(base, target) {
            for (let i in base) {
                target[i] = base[i]
            }
        },
        copyParam(base, target) {
            let tk = Object.keys(target)

            for (let i in base) {
                if (tk.indexOf(i) != -1) {
                    target[i] = base[i]
                }
            }
        },
        getSub() {
            this.check();
            (this.uid == this.model[this.ownEntity.key]) ? this.uid = '': this.uid = this.model[this.ownEntity.key].toString();
            if (this.hasChild) {
                if (this.main) {
                    this.copyParam(this.model, this.initParam)
                    this.$emit('cb', this.initParam)
                    this.getSubItem()
                } else {
                    if (this.$parent.getSub) {
                        this.copyParam(this.model, this.initParam)
                        this.$emit('cb', this.initParam, this.model)
                    }
                }
            } else {
                this.copyParam(this.model, this.initParam)
                this.$emit('cb', this.initParam, this.model)
            }
        },
        getSubItem() {
            if (this.main && !this.isFolder) {
                let url = this.entity.sub.url;
                let method = this.entity.sub.method ? this.entity.sub.method.toLowerCase() : "post";
                let dataListHandler = this.entity.sub.dataListHandler || function(res) {
                    return res.data.data.dataList;
                };
                // this.copyParam(this.model, this.initParam);
                this.subEntity = this.entity.sub;


                if (method == "post") {
                    this.$http.post(url, this.initParam).then(
                        (res) => {
                            this.subData = dataListHandler(res);
                        }
                    );
                } else {
                    this.$http.get(url, {
                        params: this.initParam
                    }).then(
                        (res) => {
                            this.subData = dataListHandler(res);
                        }
                    );
                }
            }
        },
        getLastItem(item, obj) {
            if (this.main) {
                this.copyParam(this.model, this.initParam); //base,target
                this.copyParam(this.initParam, item);
                this.$emit('cb', item, obj);
            }
        }
    },
    computed: {
        isFolder() {
            return this.subData.length > 0
        },
        ownEntity() {
            return this.main ? this.entity.main : this.entity
        },
        words() {
            return this.ownEntity.words.title
        },
        sub() {
            return this.ownEntity.words.sub
        },
        hasSub() {
            return this.ownEntity.words.sub != undefined ? true : false
        },
        key() {
            return this.ownEntity.key
        },
        param() {
            return this.ownEntity.param
        },
        url() {
            return this.ownEntity.url
        },
        isMain(){
            return this.main && this.hasChild
        },
        isOpen() {
            return  this.uid == this.model[this.ownEntity.key]
        },
        hasChild() {
            return this.config.hasChild
        },
        hasNub() {
            return this.config.hasNub
        }
    },
    filters: {
        title(val) {
            var displayRenderFunction;
            var _words = this.words;
            if (typeof _words != "function") {
                displayRenderFunction = function(val) {
                    let displayText = '';
                    for (let i = 0; i < _words.length; i++) {
                        if (val[_words[i]] != undefined) {
                            displayText += val[_words[i]];
                        } else {
                            displayText += _words[i];
                        }
                    }
                    return displayText;
                }
            } else {
                displayRenderFunction = _words;
            }
            return displayRenderFunction(val);
        },
        right(val) {
            let words = this.model[this.ownEntity.words.right];
            return words;
        },
        subWords(val, arr) {
            let words = ''
            for (let i = 0; i < arr.length; i++) {
                if (val[arr[i]] != undefined) {
                    words += val[arr[i]];
                } else {
                    words += arr[i];
                }
            }
            return words;
        }
    }
})
