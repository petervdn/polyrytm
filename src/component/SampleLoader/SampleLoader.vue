<style src="./SampleLoader.scss" module lang="scss"></style>
<script src="./SampleLoader.js"></script>

<template>
	<div
		:class="[$style.dropArea, isDraggingOverDropArea ? $style.dragOver : '']"
		v-on:drop.prevent.stop="onFileDrop"
		v-on:dragover.prevent.stop="onDragOver"
		v-on:dragleave.prevent.stop="onDragLeave"
		ref="dropArea"

	>
		{{isLoading ? 'loading...' : 'drop sample here to load it'}}
	</div>

</template>

