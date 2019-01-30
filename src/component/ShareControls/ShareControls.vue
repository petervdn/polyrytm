<style src="./ShareControls.scss" module lang="scss"></style>
<script src="./ShareControls.js"></script>

<template>
  <div class="controls-wrapper">
    <p class="info">
      Save and share your creation for others to enjoy! All sequences will be stored, along with the visual settings.
    </p>
    <div>
      <div>
        <label>title</label><input
          :value="localTitle"
          @input="onTitleUpdate" >
      </div>
    </div>
    <div>
      <button @click="save">save</button>
    </div>

  </div>
</template>

