<style src="./SampleManagerItem.scss" module lang="scss"></style>
<script src="./SampleManagerItem.js"></script>

<template>
  <li :class="[$style.sampleManagerItem]">
    <div :class="$style.name">
      {{ sample.name }} <small v-if="!sample.uploadData"> {{ sample.path }} </small>
      <small v-if="sample.uploadData">
        ({{ sample.uploadData.state }} {{ Math.round(sample.uploadData.progress * 100) }}%)
      </small>
    </div>
    <button
      :class="$style.remove"
      @click="$emit('delete', sample)"
    >x</button>
  </li>
</template>
