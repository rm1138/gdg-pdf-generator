<template>
  <page v-for="(page, pageNo) in pages" :key="page" :ref="'page' + pageNo">
    {{ page }}
  </page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Page from '@/components/Page.vue'
import { Data, PageData} from './Types'

const data: Data = {
  blocks: [{
    content: 'Test',
    typography: 'h1',
    blockType: 'paragraph',
  }, {
    content: 'Test 2',
    typography: 'p',
    blockType: 'paragraph'
  }]
}
export default defineComponent({
  data(): { pages: PageData[], data: Data } {
    return {
      pages: [],
      data: data
    }
  },
  mounted() {
    while(this.data.blocks.length > 0) {
      this.pages.push({
        blocks: [this.data.blocks.shift()!!],
        title: 'test',
        pageNo: 1,
        footerMsg: ''
      })
    }
    setTimeout(() => {
      console.log(this.$refs)
    }, 1000)
  },
  components: { Page }
})
</script>

<style lang="sass">
@import '~paper-css/paper.css'
</style>
