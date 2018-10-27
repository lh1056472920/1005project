<template>
    <div class="remindApp">
        <!-- <div class="remindquo">
            我是炒币工具app
        </div> -->
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    name: "App"
};
</script>

<style>
.remindApp {
    width: 100%;
    height: 100%;
}
/* .remindApp .remindquo {
    text-align: center;
    line-height: 50px;
    width: 200px;
    height: 50px;
    border: 1px solid #ccc;
    border-radius: 10px;
    margin: 0 auto;
} */
</style>
