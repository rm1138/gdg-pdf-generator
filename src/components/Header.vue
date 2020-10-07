<template>
<h1 class="title block">{{title}}</h1>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    export default defineComponent({
    name: "Header",
        props: {
            title: { type: String }
        }
    })
</script>

<style lang="scss" scoped>
.title {
    text-align: center;
}
</style>
