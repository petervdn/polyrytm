<style src="./SampleManagerItem.scss" module lang="scss"></style>
<script src="./SampleManagerItem.js"></script>

<template>
  <li :class="[$style.sampleManagerItem]">
    <div :class="$style.name">
      {{ sample.name }}
      <small v-if="!sample.processingData"> {{ sample.path }} </small>
      <small v-if="sample.processingData">
        {{ sample.processingData.state }}
        <template v-if="sample.processingData.state === SampleProcessingState.UPLOADING">
          ({{ Math.round(sample.processingData.progress * 100) }}%)
        </template>
      </small>
    </div>
    <button
      :class="$style.remove"
      @click="$emit('delete', sample)"
    >x</button>
  </li>
</template>
