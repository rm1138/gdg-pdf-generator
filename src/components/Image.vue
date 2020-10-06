<template>
<img alt="" :src="src" :width="width" :height="height"/>
<p class="caption" v-if="caption">{{caption}}</p>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: "Image",
	props: {
		src: { type: String, required: true },
		width: { type: Number, required: true },
		height: { type: Number, required: true },
		caption: { type: String }
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
