<style src="./RingSelector.scss" module lang="scss"></style>
<script src="./RingSelector.js"></script>

<template>
  <ul
    v-if="selectedDisc"
    class="selector-list">
    <li
      v-for="(ring, index) in selectedDisc.rings"
      :class="{ active: ring === selectedRing }"
      :key="index"
      @click="setSelection(ring === selectedRing ? selectedDisc : ring)"
    >{{ index + 1 }}</li>
    <li
      v-if="selectedDisc.rings.length < constants.MAX_RINGS"
      @click="addRing">+</li>
  </ul>
</template>

