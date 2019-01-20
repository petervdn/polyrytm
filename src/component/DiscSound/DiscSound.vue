<style src="./DiscSound.scss" module lang="scss"></style>
<script src="./DiscSound.js"></script>

<template>
	<div>
		<h4>{{sound.sample.name}}</h4>
		<p>
			{{sound.sample.audioBuffer.duration.toFixed(2)}} s,
			{{sound.sample.audioBuffer.numberOfChannels === 1 ? 'mono' : 'stere'}},
			{{sound.sample.audioBuffer.sampleRate}}Hz
		</p>
	</div>
</template>

