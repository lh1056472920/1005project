<template>
  <div class="multiple">
    <ul class="circle">
      <li @click="addActive(1)" :class="{activeLi:mulActive === 1}"></li>
      <li @click="addActive(2)" :class="{activeLi:mulActive === 2}"></li>
      <li @click="addActive(3)" :class="{activeLi:mulActive === 3}"></li>
      <li @click="addActive(4)" :class="{activeLi:mulActive === 4}"></li>
      <li @click="addActive(5)" :class="{activeLi:mulActive === 5}"></li>
    </ul>
    <ul class="amount">
      <li @click="addActive(1)" :class="{addColor:mulActive === 1}">1倍</li>
      <li @click="addActive(2)" :class="{addColor:mulActive === 2}">2倍</li>
      <li @click="addActive(3)" :class="{addColor:mulActive === 3}">3倍</li>
      <li @click="addActive(4)" :class="{addColor:mulActive === 4}">4倍</li>
      <li @click="addActive(5)" :class="{addColor:mulActive === 5}">5倍</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'multiple',
  props: ['mulActive'],
  data () {
    return {
      number: 0
    }
  },
  methods: {
    addActive (num) {
      // console.log(num);
      this.$emit('addMulActive', num)
    }
  }
}
</script>

<style>
.multiple .circle {
  position: relative;
  margin-top: 20px;
  width: 72%;
  background-color: #d4dde9;
  height: 2px;
}
.multiple .amount {
  display: flex;
  position: relative;
  left: -5px;
  height: 22px;
  margin-top: 5px;
  width: 76%;
  justify-content: space-between;
}
.multiple .circle li {
  position: absolute;
  top: -100%;
  background-color: #d4dde9;
  width: 6px;
  height: 6px;
  border-radius: 50%;
}
.multiple .circle li:nth-child(2) {
  left: 25%;
}
.multiple .circle li:nth-child(3) {
  left: 49.5%;
}
.multiple .circle li:nth-child(4) {
  left: 74%;
}
.multiple .circle li:nth-child(5) {
  right: 0%;
}
.multiple .circle .activeLi {
  border: 2px solid #48c122;
  background-color: #fff;
  top: -180%;
}
.multiple .circle .activeLi:nth-child(1) {
  left: -0.8%;
}
.multiple .circle .activeLi:nth-child(2) {
  left: 24.4%;
}
.multiple .circle .activeLi:nth-child(3) {
  left: 49%;
}
.multiple .circle .activeLi:nth-child(4) {
  left: 73.3%;
}
.multiple .circle .activeLi:nth-child(5) {
  right: -0.8%;
}
.multiple .amount .addColor {
  color: #42c300;
}
</style>

