<template>
    <div class="block">
        <div v-if="block.blockType === 'paragraph'">
            <paragraph-component :typography="block.typography" :content="block.content"/>
        </div>
        <div v-if="block.blockType === 'image'">
            <image-component
                    :src="block.url"
                    :width="block.width"
                    :height="block.height"
                    :caption="block.caption"
                    @image-loaded="(src) => $emit('image-loaded', src)"/>
        </div>
        <div v-if="block.blockType === 'table'">
            <table-component/>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
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
