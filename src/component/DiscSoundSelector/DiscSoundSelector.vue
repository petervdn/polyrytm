<style src="./DiscSoundSelector.scss" module lang="scss"></style>
<script src="./DiscSoundSelector.js"></script>

<template>
  <div :class="[$style.discSoundSelector]">
    <div>
      <button
        v-for="sound in selectedDisc.sounds"
        :class="$style.item"
        :key="sound.sample.path"
      >
        {{ sound.sample.name }} <small v-if="!sound.sample.audioBuffer"> (loading...) </small>
        <small v-if="sound.sample.audioBuffer">
          ({{ sound.sample.audioBuffer.duration.toFixed(1) }}s
          {{ sound.sample.audioBuffer.numberOfChannels === 1 ? 'mono' : 'stereo' }})
        </small>
      </button>
    </div>
    <div :class="$style.add">
      <select
        v-if="samples.length > 0"
        v-model="selectedSampleIndex"
        @change="onSelectChange"
      >
        <option value="-1">Add a sample to this disc</option>
        <option
          v-for="(sample, index) in samples"
          :value="index"
          :key="sample.name"
        >
          {{ sample.name }}
          <!--({{sample.audioBuffer ? sample.audioBuffer.duration.toFixed(2) + 's' : 'not yet loaded'}})-->
        </option>
      </select>
      <p v-if="samples.length === 0">No samples found</p>
    </div>
  </div>
</template>
