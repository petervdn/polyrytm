<style src="./RingControls.scss" module lang="scss"></style>
<script src="./RingControls.js"></script>


<template>
  <div class="controls-wrapper">
    <p class="info">
      Rings are independent step-sequencers, and are responsible for actually triggering sound-slices.
      Every step will start a slice with a certain volume. You can assign one or more slices to each ring,
      the mode for the ring decides which slice will be chosen (currently random).
    </p>
    <div v-if="selectedRing">

      <h3>selected ring <button 
        class="remove" 
        @click="onRemoveClick">remove</button></h3>

      <h4>divisions (now {{ selectedRing.items.length }})</h4>

      <button @click="adjustRingItems(1)">1</button>
      <button @click="adjustRingItems(2)">2</button>
      <button @click="adjustRingItems(4)">4</button>
      <button @click="adjustRingItems(8)">8</button>
      <button @click="adjustRingItems(16)">16</button>
      <button @click="adjustRingItems(32)">32</button>
      <button @click="adjustRingItems(selectedRing.items.length - 1)">-1</button>
      <button @click="adjustRingItems(selectedRing.items.length + 1)">+1</button>
      <br>
      <p v-if="false">
        volume for new items:

        <select v-model="newRingItemsVolumeMode">
          <option value="random">random</option>
          <option value="zero">0</option>
          <option value="one">1</option>
        </select>
      </p>

      <br>
      <h4>volumes</h4>
      <button @click="adjustVolumes('random')">random</button>
      <button @click="adjustVolumes('alternate')">alt</button>
      <button @click="adjustVolumes('shift+1')">shift +1</button>
      <button @click="adjustVolumes('shift-1')">shift -1</button>
      <button @click="adjustVolumes('all-0')">all 0</button>
      <button @click="adjustVolumes('all-1')">all 1</button>
      <button @click="adjustVolumes('x2')">x 2</button>
      <button @click="adjustVolumes('x0.5')">x 0.5</button>
    </div>
    <div v-if="!selectedRing">
      <p class="no-selection">No ring selected</p>
    </div>
  </div>
</template>


