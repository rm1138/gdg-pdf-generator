<template>
<h1 class="title block">{{title}}</h1>
</template>

<script lang="ts">
export default {
name: "Header",
    props: {
        title: { type: String }
    }
}
</script>

<style lang="scss" scoped>
.title {
    text-align: center;
}
</style>
