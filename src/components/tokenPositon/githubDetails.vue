<template>
    <div class="github-detail">
        <!-- <p>我无得救啦,救无到啦</p> -->
        <div v-html="detail" class="detail"></div>
    </div>
</template>

<script>
import remote from "../../lib/js/remote.js";
export default {
    data() {
        return {
            orgName: "",
            repoName: "",
            detail:''
        };
    },
    mounted() {
        this.getQueryData();
    },
    methods: {
        getQueryData() {
            console.log(this.$route);
            this.repoName = this.$route.query.repoName;
            this.orgName = this.$route.query.orgName;
            if (this.repoName !== "" && this.orgName !== "") {
                let params = new URLSearchParams();
                params.append("repoName", this.repoName);
                params.append("orgName", this.orgName);
                remote.github_details(params).then(res=>{
                    console.log(res);
                    this.detail = res.data.dataImage
                })
            }
        }
    }
};
</script>
<style>
.github-detail .detail {
    padding: 10px;
    box-sizing: border-box;
}
.github-detail a{
    text-decoration: none;
    color:#333; 
}
</style>
