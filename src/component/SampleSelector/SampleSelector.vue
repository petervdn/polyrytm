<style src="./SampleSelector.scss" module lang="scss"></style>
<script src="./SampleSelector.js"></script>

<template>
	<div>
		<select
			v-model="selectedSampleIndex"
			v-if="samples.length > 0"
			@change="onSelectChange"
		>
			<option value="-1">Select a sample for this disc</option>
			<option v-for="(sample, index) in samples" :value="index">
            	{{sample.name}}
            	<!--({{sample.audioBuffer ? sample.audioBuffer.duration.toFixed(2) + 's' : 'not yet loaded'}})-->
         	</option>
        </select>
		<p v-if="samples.length === 0">No samples found</p>
	</div>
</template>
