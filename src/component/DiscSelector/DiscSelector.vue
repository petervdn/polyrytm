<style src="./DiscSelector.scss" module lang="scss"></style>
<script src="./DiscSelector.js"></script>

<template>
	<ul class="selector-list">
		<li
			v-for="(disc, index) in discs"
			@click="setSelection(disc === selectedDisc && discs.length > 1 ? null : disc)"
			:class="{ active: disc === selectedDisc }"
		>
			{{index + 1}}
		</li>
		<li @click="addDisc()">+</li>
	</ul>
</template>

