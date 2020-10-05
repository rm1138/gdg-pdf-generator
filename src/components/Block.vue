<template>
    <div>
        <div v-if="block.blockType === 'paragraph'">
            <paragraph-component/>
        </div>
        <div v-if="block.blockType === 'image'">
            <image-component/>
        </div>
        <div v-if="block.blockType === 'table'">
            <table-component/>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Block } from '@/Types'
import ParagraphComponent from './Paragraph.vue'
import ImageComponent from './Image.vue'
import TableComponent from './Table.vue'

export default defineComponent({
    props: {
        block: { type: Object as PropType<Block> }
    },
    components: { ParagraphComponent, ImageComponent, TableComponent }
})
</script>

<style scoped>

</style>
