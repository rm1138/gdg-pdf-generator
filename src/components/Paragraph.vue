<template>
    <h1 v-if="typography === 'h1'">{{ content }}</h1>
    <h2 v-if="typography === 'h2'">{{ content }}</h2>
    <h3 v-if="typography === 'h3'">{{ content }}</h3>
    <h4 v-if="typography === 'h4'">{{ content }}</h4>
    <h5 v-if="typography === 'h5'">{{ content }}</h5>
    <h6 v-if="typography === 'h6'">{{ content }}</h6>
    <p v-if="typography === 'p'">{{ content }}</p>
</template>

<script lang="ts">
    import {defineComponent, PropType} from 'vue'

    export default defineComponent({
        name: "Paragraph",
        props: {
            content: {type: String, required: true},
            typography: {type: String as PropType<Typography>, required: true}
        }
    })
</script>

<style scoped>

</style>
