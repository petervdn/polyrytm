<style src="./DiscSound.scss" module lang="scss"></style>
<script src="./DiscSound.js"></script>

<template>
  <div :class="$style.wrap">
    {{ sound.sample.name }}
    <small v-if="!sound.sample.audioBuffer">
      (loading...)
    </small>
    <small v-if="sound.sample.audioBuffer">
      ({{ sound.sample.audioBuffer.duration.toFixed(1) }}s {{ sound.sample.audioBuffer.numberOfChannels === 1 ? 'mono' : 'stereo' }})
    </small>
  </div>
</template>

