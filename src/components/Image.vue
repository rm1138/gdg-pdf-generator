<template>
  <div ref="blockRef" class="block">
    <img
      :src="image.url"
      :style="{ height: image.height + 'px', width: image.width + 'px' }"
      alt=""
      @load.once="$emit('image-loaded', image.url)"
    />
    <p v-if="image.caption" class="caption">{{ image.caption }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'

export default defineComponent({
  emits: ['image-loaded'],
  props: {
    image: { type: Object as PropType<DummyImage>, required: true },
  },
  setup() {
    const blockRef = ref<HTMLDivElement | null>(null)
    return {
      blockRef,
      getHeightMap(): number[] {
        return [blockRef.value!!.offsetHeight]
      },
    }
  },
})
</script>

<style lang="scss" scoped>
img {
  margin-left: auto;
  margin-right: auto;
  display: block;
}

.caption {
  text-align: center;
}
</style>
