<template>
  <div class="block">
    <table>
      <thead ref="headerRef">
        <tr>
          <th v-for="col in table.titles" :key="col">{{ col }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, idx) in table.data" :key="idx" :ref="setRowRefs">
          <td v-for="(cell, cellIdx) in row" :key="cellIdx">{{ cell }}</td>
        </tr>
      </tbody>
    </table>
    <div v-if="table.splited !== true" ref="captionRef">
      <p class="caption">{{ table.caption }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'

export default defineComponent({
  props: {
    table: {
      type: Object as PropType<DummyTable>,
      required: true,
    },
  },
  setup() {
    const headerRef = ref<HTMLTableRowElement | null>(null)
    const captionRef = ref<HTMLElement | null>(null)
    const rowRefs: HTMLTableRowElement[] = []
    return {
      headerRef,
      captionRef,
      setRowRefs(el: HTMLTableRowElement) {
        rowRefs.push(el)
      },
      getHeightMap(): number[] {
        return [
          headerRef.value!!.offsetHeight,
          ...rowRefs.map((it) => it.offsetHeight),
          captionRef.value!!.offsetHeight,
        ]
      },
    }
  },
})
</script>

<style lang="scss" scoped>
table {
  border-collapse: collapse;
  margin-right: auto;
  margin-left: auto;
}

table,
th,
td {
  border: pxToMm(1) black solid;
  padding: pxToMm(10);
}

th {
  text-transform: capitalize;
}

.caption {
  text-align: center;
  margin: 0;
  padding: 1em;
}
</style>
