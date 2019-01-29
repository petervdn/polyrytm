<style src="./MixerControls.scss" module lang="scss"></style>
<script src="./MixerControls.js"></script>

<template>
  <div class="controls-wrapper">
    <p class="info">
      Control volumes and effects.
    </p>
    <DiscMixer
      v-for="(disc, index) in discs"
      :key="index"
      :label="`disc ${index+1}`"
      :disc="disc"
    />
  </div>
</template>

