import Vue from 'vue'
import MessageBox from './../components/messageBox.vue'

const _MessageBox = Vue.extend(MessageBox);
let nId = 1;
const messageBox = (content,options) => {
    return new Promise((resolve,reject) => {
        let id = 'messageBox-' + nId++
        const MessageBoxInstance = new _MessageBox({
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
        
        MessageBoxInstance.id = id;
        MessageBoxInstance.vm = MessageBoxInstance.$mount();
        MessageBoxInstance.vm.visible = true;
        MessageBoxInstance.dom = MessageBoxInstance.vm.$el;
        document.body.appendChild(MessageBoxInstance.dom);
        MessageBoxInstance.dom.style.zIndex = nId + 1001;
    });
}

export default {
    install: Vue => {
        Vue.prototype.$messageBox = messageBox;
    }
}