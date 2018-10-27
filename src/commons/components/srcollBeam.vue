<template>
    <div class="scroll">
        <div class="marquee">
            <div class="marquee_title">
                <span class="notice">公告</span>
            </div>
            <div class="marquee_box">
                <!-- <ul class="marquee_list" :style="{ top: '-'+scrollNum + 'px'}" :class="{marquee_top:scrollNum}"> -->
                <!-- 当显示最后一条的时候（num=0转换布尔类型为false）去掉过渡效果-->
                <!-- <li v-for="(item, index) in marqueeList" :key="index">
                        <span>
                            {{item.city}}
                        </span>
                    </li>
                </ul> -->
                <div class="float-box" :style="{ left: '-'+scrollNum + 'px'}" :class="{marquee_top:scrollNum}">
                    <span ref="spandata" v-for="(item, index) in marqueeList" :key="index">{{item.city}}</span>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
export default {
    name: "scrollBeam",
    data() {
        return {
            scrollNum: 0,
            marqueeList: [
                {
                    city: "泰国新加坡印度尼西亚",
                    amount: "10"
                },
                {
                    city: "咖喱肉骨茶印尼九层塔",
                    amount: "20"
                },
                {
                    city: "做SPA放烟花蒸桑拿",
                    amount: "30"
                },
                {
                    city: "Coco Pineapple Mango",
                    amount: "30"
                },
                {
                    city: "沙巴芭堤雅阳光热辣辣",
                    amount: "30"
                },
                {
                    city: "香瓜啤酒花风景美如画",
                    amount: "30"
                },
                {
                    city: "夜市下海鲜架泳池趴",
                    amount: "30"
                },
                {
                    city: "嘟嘟嘟嘟干嘛干嘛呀",
                    amount: "30"
                },
                {
                    city: "咖喱咖喱轻轻一加,咖喱咖喱辣",
                    amount: "30"
                },
                {
                    city: "咖喱咖喱香蕉木瓜,榴莲臭臭配香茶",
                    amount: "30"
                },
                {
                    city: "咖喱咖喱摩托皮卡,咖喱咖喱呀",
                    amount: "30"
                },
                {
                    city: "咖喱咖喱夜市酒吧,热情奔放火辣辣,咖喱咖喱",
                    amount: "30"
                }
            ]
        };
    },
    created() {
        this.getScrollNum();
    },
    mounted: function() {
        this.showMarquee(this.scrollNum);
    },
    methods: {
        showMarquee: function(num) {
            let that = this;
            let step = 0;
            that.$nextTick(function() {
                // DOM 更新了
                let refdata = that.$refs.spandata;
                if (refdata) {
                    refdata.forEach(item => {
                        step += item.offsetWidth;
                    });
                    if (step !== 0) {
                        setTimeout(() => {
                            setInterval(function() {
                                num++;
                                if (num >= step) {
                                    num = 0;
                                }
                                that.scrollNum = num;
                            }, 50);
                        }, 500);
                    }
                }
            });
        },
        getScrollNum() {
            this.scrollNum = Number(sessionStorage.getItem("scrollNum")) || 0;
        }
    },
    beforeDestroy() {
        sessionStorage.setItem("scrollNum", this.scrollNum);
    }
};
</script>

<style>
.float-box {
    position: absolute;
}
.float-box span {
    /* float: left; */
    height: 30px;
    line-height: 30px;
    white-space: nowrap;
    padding: 0 15px;
}
.float-box span:nth-child(1) {
    padding-left: 25px;
}
.scroll .marquee {
    width: 100%;
    height: 30px;
    align-items: center;
    color: #3a3a3a;
    display: flex;
    box-sizing: border-box;
    background:rgba(254,245,232,1);
}
.scroll .marquee_title {
    width: 20%;
    text-align: center;
    height: 30px; /*关键样式*/
    font-size: 14px;
    line-height: 30px;
    align-items: center;
}

.scroll .marquee_box {
    display: block;
    position: relative;
    width: 80%;
    height: 30px; /*关键样式*/
    overflow: hidden;
}
.scroll .marquee_list {
    width: 100%;
    display: block;
    position: absolute;
    top: 0;
    left: 0;
}
.scroll .marquee_top {
    transition: top 0.8s;
} /*关键样式*/
.scroll .marquee_list li {
    display: inline-block;
    float: left;
    height: 30px; /*关键样式*/
    line-height: 30px; /*关键样式*/
    font-size: 14px;
    padding-left: 20px;
    background-color: #fff;
}
.scroll .marquee_list li span {
    padding: 0 2px;
}
.scroll .red {
    white-space: nowrap;
    color: #ff0101;
}
.notice{
    display: inline-block;
    text-align: center;
    width: 0.97rem;
    height: 0.47rem;
    line-height: 0.47rem;
    border:1px solid rgba(244,62,58,1);
    border-radius: 0.03rem;
    color: #F43E3A;
    font-size: 0.32rem;
}
</style>

