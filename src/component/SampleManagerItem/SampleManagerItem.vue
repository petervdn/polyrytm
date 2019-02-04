<style src="./SampleManagerItem.scss" module lang="scss"></style>
<script src="./SampleManagerItem.js"></script>

<template>
  <div :class="[$style.sampleManagerItem]">
    <p>{{ sample.name }}
      <small v-if="!sample.uploadData">
        {{ sample.path }}
      </small>
      <small v-if="sample.uploadData">
        ({{ sample.uploadData.state }} {{ Math.round(sample.uploadData.progress * 100) }}%)
      </small>
    </p>
  </div>
</template>
