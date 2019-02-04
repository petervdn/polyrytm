<style src="./SampleManager.scss" module lang="scss"></style>
<script src="./SampleManager.js"></script>

<template>
  <div :class="[$style.sampleManager]">
    <h2>SampleManager</h2>
    <SampleManagerItem
      v-for="sample in samples"
      :sample="sample"
      :key="sample.name"
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
        @click="onAddSamplesClick"
      >
        add samples
      </button>
    </div>
  </div>
</template>
