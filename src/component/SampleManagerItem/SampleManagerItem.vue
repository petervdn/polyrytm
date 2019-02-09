<style src="./SampleManagerItem.scss" module lang="scss"></style>
<script src="./SampleManagerItem.js"></script>

<template>
  <li :class="[$style.sampleManagerItem]">
    <div :class="$style.name">
      {{ sample.name }}
      <small v-if="sample.state === SampleState.READY"> {{ sample.path }} </small>
      <small v-if="sample.state !== SampleState.READY">
        {{ sample.state }}
        <template v-if="sample.state === SampleState.UPLOADING">
          ({{ Math.round(sample.uploadProgress * 100) }}%)
        </template>
      </small>
    </div>
    <button
      :class="$style.remove"
      @click="$emit('delete', sample)"
    >x</button>
  </li>
</template>
