<style src="./DiscControls.scss" module lang="scss"></style>
<script src="./DiscControls.js"></script>

<template>
  <div class="controls-wrapper">
    <p class="info">
      Discs are the main objects of Polyrytm. They consist of rings (max {{ constants.MAX_RINGS }}) and
      samples (max {{ constants.MAX_SAMPLES }}). Each sample can be divided into slices, which are the actual
      sounds that will be played, as controlled by the rings.
    </p>
    <div v-if="selectedDisc">
      <h3>selected disc
        <button
          v-if="discs.length > 1"
          class="remove"
          @click="onRemoveClick">remove</button>
      </h3>

      <div v-if="selectedDisc.sound.sample">
        <label>Number of slices: {{ selectedDisc.sound.slices.length }}</label>

        <input
          :value="selectedDisc.sound.slices.length"
          min="1"
          max="32"
          type="range"
          @input="updateSlices" >
        <br><br>
        <button @click="matchTime">set current sample length as seconds/revolution</button>
      </div>
      <DiscSoundSelector />
    </div>
    <div v-if="!selectedDisc">
      <p class="no-selection">No disc selected</p>
    </div>
  </div>
</template>

