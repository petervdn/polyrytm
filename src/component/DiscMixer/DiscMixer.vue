<style src="./DiscMixer.scss" module lang="scss"></style>
<script src="./DiscMixer.js"></script>

<template>
	<div :class="$style.wrapper">
		<p>{{label}}</p>
		<div :class="$style['fader-cols']">
			<MixerFader />

			<MixerFader
				v-for="(ring, index) in disc.rings"
				:key="index"
			/>
		</div>
	</div>
</template>

