<style src="./NewSampleManager.scss" module lang="scss"></style>
<script src="./NewSampleManager.js"></script>

<template>
  <div :class="[$style.newSampleManager]">
    <h2>SampleManager</h2>
    <SampleManagerItem
      v-for="item in items"
      :item="item"
      :key="item.name"
      @uploadStateChange="value => onItemUploadStateChange(item, value)"
    />
    <div :class="$style.add">
      <input
        v-show="false"
        ref="fileSelect"
        type="file"
        multiple
        name="sample"
        @change="onFileSelectionChange"
      >

      <button
        v-if="canUpload"
        @click="addSamples"
      >
        add samples
      </button>
    </div>
  </div>
</template>
