<template>
<!-- 编辑自选页面 -->
    <div class="editOptional">
        <!-- <header-item class="header" :title="$t('m.editOptional')" :back="false" :accomplish="true"></header-item> -->
        <header>
            <span class="title">编辑自选</span>
            <span class="accomplish" v-tap="{methods: complete}">完成</span>
        </header>
        <ul class="subtitle">
            <li>{{$t('m.name')}}</li>
            <li>{{$t('m.toTop')}}</li>
            <li class="selectAll" v-tap="{methods:selectAll,params:selectedId}">{{$t('m.selectAll')}}</li>
        </ul>
        <ul class="editOpt-content">
            <li v-for="(item,i) in optionalList" :key="i">
               <edit-optItem
               :coin="item.coin"
               :market-name="item.marketName"
               :counterparty="item.counterparty"
               :select="item.select"
               :index="i"
               v-on:toTop='up'
               v-on:selected='selectOne'
               ></edit-optItem>
               <hr>
            </li>
        </ul>
        <div id="delete" :class="{active:active}" v-tap="{methods:remove}">删除</div>
        
    </div>
</template>
<style scoped>
.editOptional {
    width: 100%;
    height: calc(100vh);
    overflow-y: auto;
}

header {
    height: 1.44rem;
    width: 100%;
    display: flex;
    justify-content: flex-end;
    background-color: rgba(244,247,249,1);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    box-shadow:0px 2px 2px rgba(230,238,242,1);
}

.title {
  width: 8.14rem;
  height: 1.44rem;
  line-height: 1.44rem;
  text-align: center;
  font-size: 0.54rem;
  color: #404040;
}

.accomplish {
        font-size: 0.41rem;
        padding-right: 0.42rem;
        color: #42C300;
        line-height: 1.44rem;
}

.subtitle {
    height: 0.82rem;
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    font-size: .36rem;
    color: #A6AFBA;
    position: fixed;
    top: 1.44rem;
    left: 0;
    background-color: rgb(237, 241, 244);
}

.subtitle li {
    flex: 1;
    text-align: center;
}

.subtitle li:first-child {
    flex: 2;
}

.selectAll {
    color: #48C122;
}

.editOpt-content {
    padding-top: 2.26rem;
    padding-bottom: 1.62rem;
}

#delete {
    width: 100%;
    height: 1.62rem;
    line-height: 1.62rem;
    text-align: center;
    font-size: .42rem;
    background-color: rgba(248,252,255,1);
    color: #A6AFBA;
    position: fixed;
    bottom: 0;
    left: 0;
    box-shadow:0px -2px 2px rgba(230,238,242,1);
}

#delete.active {
    color:#F43E3A;
}


</style>
<script>
import HeaderItem from '../../commons/components/HeaderItem.vue'
import editOptItem from '../../commons/components/editOptItem.vue'
import { MessageBox } from 'mint-ui'
export default {
        name:'editOptional',
        components:{
            HeaderItem,
            editOptItem
        },
        data(){
            return {
                isSelectAll:false,
                active:false,//删除栏状态
                optionalList:[],
                optionalId:[],
                selectedId:[],
                innerText:'',
                username:''
            }
        },
        created(){
        },
        mounted(){
            // console.log(this.$store.state.optionalList);
            let optionalListArr = JSON.parse(window.sessionStorage.getItem("optionalList"));
            // console.log(optionalListArr);
            
            let user = this.$store.state.userInfo;
            this.username = user.username;
            // this.$store.state.optionalList.forEach((item,i)=>{
            //     item['select']=false
            // })
            // this.optionalList = this.$store.state.optionalList
            this.optionalList = this.marketTokenSplit(optionalListArr)
        },
        methods:{
            event(){
                var subtitle = document.getElementById('subtitle')
                subtitle.style.backgroundColor = '#edf1f4'
            },
            selectAll(data){
                this.optionalId = []
                this.optionalList.forEach((item,i)=>{
                    this.optionalId.push(i)
                })
                // 全选
                if(data.params.length<this.optionalId.length){
                    this.selectedId = this.optionalId
                    this.optionalList.forEach((item,i)=>{
                        item.select = true
                    })
                }else if(data.params.length==this.optionalId.length){
                    this.selectedId = []
                    this.optionalList.forEach((item,i)=>{
                        item.select = false
                    })
                }
                this.deleteActive()
            },
            up(data){
                this.selectedId.forEach((item,i)=>{
                    if(item < data){
                        this.selectedId[i]=item+1
                    }
                    if(item == data){
                        this.selectedId.splice(i,1)
                        this.selectedId.unshift(0)
                    }
                    
                })
                console.log(this.selectedId);
                
                // 监听子组件传来的index 置顶
                let id = this.optionalList[data].uuid
                let arr = this.optionalList
                let item = arr.splice(data,1)[0];
                arr.unshift(item)
                this.optionalList = arr
                console.log(id);
                let url = `https://www.blockgdex.com/kpl/wallert/coll/save?uuid=${id}`
                this.$axios.put(url).then(res=>{
                    console.log(res);
                    if(res.status==200){
                        // 获取自选项
                                
                        let url2 = `https://www.blockgdex.com/kpl/wallert/coll/select?userName=${
                        this.username
                        }`;
                        this.$axios.get(url2).then(res => {
                            if(res.status==200){
                                console.log(res.data);
                                let optionalList = res.data
                                window.sessionStorage.setItem('optionalList', JSON.stringify(optionalList))
                                this.$store.commit('setOptionalList',optionalList)
                            }
                        })
                    }
                })

            },
            selectOne(data){
                console.log(data);
                
                if(data.isSelect){
                    this.optionalList[data.index].select = true
                    if(this.selectedId.indexOf(data.index)==-1){
                        this.selectedId.push(data.index)
                    }
                }
                if(!data.isSelect){ 
                    if(this.selectedId.indexOf(data.index)>=0){
                        this.optionalList[data.index].select = false
                        this.selectedId.forEach((item,i)=>{
                            if(data.index == item){
                                this.selectedId.splice(i,1)
                            }
                        })
                    }
                }
                console.log(this.selectedId);
                
                this.deleteActive()
            },
            deleteActive(){
                // 判断是否有勾选
                if(this.selectedId.length>0){
                    this.active = true
                }else if(this.selectedId.length == 0){
                    this.active = false
                }
            },
            remove(){
                // 删除
                if(this.active){
                    MessageBox.confirm('',{ // 提示信息
                        title:this.$t('m.tips'),
                        message:'确认删除选中项目？'
                    }).then(action=>{
                        let arr = []
                        let arr1 = []
                        this.optionalList.forEach((item,i)=>{
                            if(item.select==false){
                                arr.push(item)
                            }else if(item.select==true){
                                arr1.push(item.uuid)
                            }
                        })
                        this.optionalList = arr
                        if(arr1.length==1){
                            let url = `http://192.168.1.225:5656/kpl/wallert/coll/delete?uuid=${arr1[0]}`
                            this.$axios.delete(url).then(res=>{
                                console.log(res);
                                // 获取自选项
                                
                                let url2 = `http://192.168.1.225:5656/kpl/wallert/coll/select?userName=${
                                this.username
                                }`;
                                this.$axios.get(url2).then(res => {
                                    if(res.status==200){
                                        console.log(res.data);
                                        let optionalList = res.data
                                        window.sessionStorage.setItem('optionalList', JSON.stringify(optionalList))
                                        this.$store.commit('setOptionalList',optionalList)
                                    }
                                })
                            })
                        }else if(arr1.length>1){
                            let url = `http://192.168.1.225:5656/kpl/wallert/coll/deletelist?uuids=${arr1}`
                            this.$axios.delete(url).then(res=>{
                                console.log(res);
                                // 获取自选项
                                
                                let url2 = `http://192.168.1.225:5656/kpl/wallert/coll/select?userName=${
                                this.username
                                }`;
                                this.$axios.get(url2).then(res => {
                                    if(res.status==200){
                                        console.log(res.data);
                                        let optionalList = res.data
                                        window.sessionStorage.setItem('optionalList', JSON.stringify(optionalList))
                                        this.$store.commit('setOptionalList',optionalList)
                                    }
                                })
                            })
                        }
                        
                        this.active = false
                    }).catch(() => {
                    });;
                    
                }
            },
            marketTokenSplit(arr0){
                let arr = []
                arr0.forEach((item, i) => {
                    let counterparty = "";
                    let coin = "";
                    if (item.marketName == "币安") {
                    if (item.marketToken.lastIndexOf("BTC") > 0) {
                            counterparty = "BTC";
                            coin = item.marketToken.split("BTC")[0];
                    } else if (item.marketToken.lastIndexOf("ETH") > 0) {
                            counterparty = "ETH";
                            coin = item.marketToken.split("ETH")[0];
                    } else if (item.marketToken.lastIndexOf("BNB") > 0) {
                            counterparty = "BNB";
                            coin = item.marketToken.split("BNB")[0];
                    } else if (item.marketToken.lastIndexOf("USDT") > 0) {
                            counterparty = "USDT";
                            coin = item.marketToken.split("USDT")[0];
                    }
                    } else if (item.marketName == "火币" || item.marketName == "ZB") {
                    if (item.marketToken.substring(item.marketToken.length-3) == 'btc') {
                            counterparty = "btc";
                            coin = item.marketToken.split("").reverse().join("").slice(3).split("").reverse().join("")
                    } else if (item.marketToken.lastIndexOf("eth") > 0) {
                            counterparty = "eth";
                            coin = item.marketToken.split("eth")[0];
                    } else if (item.marketToken.lastIndexOf("ht") > 0) {
                            counterparty = "ht";
                            coin = item.marketToken.split("ht")[0];
                    } else if (item.marketToken.lastIndexOf("qc") > 0) {
                            counterparty = "qc";
                            coin = item.marketToken.split("qc")[0];
                    } else if (item.marketToken.lastIndexOf("zb") > 0) {
                            counterparty = "zb";
                            coin = item.marketToken.split("zb")[0];
                    } else if (item.marketToken.lastIndexOf("usdt") > 0) {
                            counterparty = "usdt";
                            coin = item.marketToken.split("usdt")[0];
                    }
                    } else if (item.marketName == "Gate") {
                            coin = item.marketToken.split("_")[0].toLocaleUpperCase();
                            counterparty = item.marketToken.split("_")[1].toLocaleUpperCase();
                    } else {
                            coin = item.marketToken.split("_")[0];
                            counterparty = item.marketToken.split("_")[1];
                    }

                    arr.push({
                            symbol: item.marketToken,
                            counterparty: counterparty,
                            coin: coin,
                            marketName: item.marketName,
                            uuid: item.uuid,
                            select:false
                    });
                });
                return arr
            },
            complete(){
                this.$router.goBack()
            }
        }
    }
</script>