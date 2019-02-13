<style src="./HomePage.scss" module lang="scss"></style>
<script src="./HomePage.js"></script>

<template>
  <div>
    <div>
      <p>
        Polyrytm is a polyrhythmic sequencer and beatslicer. Follow on
        <a
          href="http://facebook.com/polyrytm"
          target="_blank">Facebook</a> or
        <a
          href="http://twitter.com/polyrytm"
          target="_blank">Twitter</a> if you want to be informed about updates!
      </p>

      <h3>latest rytms</h3>
      <RytmList :rytms="rytms"/>
    </div>
  </div>
</template>
