<style src="./DiscView.scss" module lang="scss"></style>
<script src="./DiscView.js"></script>

<template>
	<div :class="[$style['disc-view'], isInEditor ? $style.editor : '']" ref="wrapper">
		<div
			v-for="(disc, index) in discs"
			:style="{
				position: 'absolute',
				width: (sizeData.squareSize) + 'px',
				height: (sizeData.squareSize) + 'px',
				top: verticalTop + 'px',
				left: (leftOffset + (index * sizeData.squareSize * scale)) + 'px',
				transform: `scale(${scale},${scale})`
			}"
		>
			<DiscViewItem
					:key="index"
					:index="index"
					:disc="disc"
					:sizeData="sizeData"
			/>
		</div>
	</div>
</template>

±
