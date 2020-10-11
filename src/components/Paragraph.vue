<template>
  <div class="block">
    <h1 v-if="paragraph.typography === 'h1'">{{ paragraph.content }}</h1>
    <h2 v-if="paragraph.typography === 'h2'">{{ paragraph.content }}</h2>
    <h3 v-if="paragraph.typography === 'h3'">{{ paragraph.content }}</h3>
    <h4 v-if="paragraph.typography === 'h4'">{{ paragraph.content }}</h4>
    <h5 v-if="paragraph.typography === 'h5'">{{ paragraph.content }}</h5>
    <h6 v-if="paragraph.typography === 'h6'">{{ paragraph.content }}</h6>
    <p v-if="paragraph.typography === 'p'">{{ paragraph.content }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'Paragraph',
  props: {
    paragraph: { type: Object as PropType<DummyParagraph>, required: true },
  },
  methods: {
    getHeightMap(): number[] {
      return [this.$el.offsetHeight]
    },
  },
})
</script>

<style scoped></style>
