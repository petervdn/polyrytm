<style src="./SampleManagerItem.scss" module lang="scss"></style>
<script src="./SampleManagerItem.js"></script>

<template>
  <div :class="[$style.sampleManagerItem]">
    <p>{{ item.name }} <small v-if="item.uploadData">({{ item.uploadData.state }})</small></p>
  </div>
</template>
