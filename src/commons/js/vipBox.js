import Vue from 'vue'
import VipBox from './../components/vipBox.vue'

const _VipBox = Vue.extend(VipBox);
let nId = 1;
const vipBox = (content,options) => {
    return new Promise((resolve,reject) => {
        let id = 'vipBox-' + nId++
        const VipBoxInstance = new _VipBox({
            data: {
                content: content
            },
            methods: {
                cancle(params) {
                    reject(params);
                },
                confirm(params) {
                    resolve(params)
                }
            }
        })
        
        VipBoxInstance.id = id;
        VipBoxInstance.vm = VipBoxInstance.$mount();
        VipBoxInstance.vm.visible = true;
        VipBoxInstance.dom = VipBoxInstance.vm.$el;
        document.body.appendChild(VipBoxInstance.dom);
        VipBoxInstance.dom.style.zIndex = nId + 1001;
    });
}

export default {
    install: Vue => {
        Vue.prototype.$vipBox = vipBox;
    }
}