<template>
  <div class="sheet padding-10mm">
    <header-component/>
    <block-component v-for="(block, idx) in blocks" :block="block" :key="idx"/>
    <footer-component/>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'
import BlockComponent from './Block.vue'
import HeaderComponent from './Header.vue'
import FooterComponent from './Footer.vue'
import {Block} from "@/Types";

export default defineComponent({
  props: {
    blocks: { type: Object as PropType<Block[]> }
  },
  components: { BlockComponent, HeaderComponent, FooterComponent },
  methods: {
    isOverflowed(): boolean {
      return (this.blocks?.length ?? 0) > 3
    }
  }
})
</script>
<style lang="scss">

</style>
