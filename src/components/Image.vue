<template>
    <div class="block" ref="blockRef">
        <img :style="{ height: image.height + 'px', width: image.width + 'px' }" :src="image.url" @load.once="$emit('image-loaded', image.src)" alt=""/>
        <p class="caption" v-if="image.caption">{{image.caption}}</p>
    </div>
</template>

<script lang="ts">
    import {defineComponent, PropType, ref} from 'vue'

    export default defineComponent({
        emits: ['image-loaded'],
        props: {
            image: { type: Object as PropType<DummyImage>, required: true},
        },
        setup() {
          const blockRef = ref<HTMLDivElement | null>(null)
          return {
            blockRef,
            getHeightMap(): number[] {
              return [blockRef.value!!.offsetHeight]
            }
          }
        }
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
