<template>
  <div class="block">
    <h1 class="title">{{ title }}</h1>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Header',
  props: {
    title: { type: String },
  },
})
</script>

<style lang="scss" scoped>
.title {
  text-align: center;
}
</style>
