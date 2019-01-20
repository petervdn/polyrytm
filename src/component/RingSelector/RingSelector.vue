<style src="./RingSelector.scss" module lang="scss"></style>
<script src="./RingSelector.js"></script>

<template>
	<ul v-if="selectedDisc" class="selector-list">
		<li
			v-for="(ring, index) in selectedDisc.rings"
			@click="setSelection(ring === selectedRing ? selectedDisc : ring)"
			:class="{ active: ring === selectedRing }"
		>{{index + 1}}</li>
		<li @click="addRing" v-if="selectedDisc.rings.length < constants.MAX_RINGS">+</li>
	</ul>
</template>

