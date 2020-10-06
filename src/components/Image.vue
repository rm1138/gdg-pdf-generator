<template>
<img :src="src" :width="width" :height="height"/>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: "Image",
	props: {
		src: { type: String, required: true },
		width: { type: Number, required: true },
		height: { type: Number, required: true }
	}
})
</script>

<style scoped>

</style>
