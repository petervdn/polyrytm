<style src="./UserSampleListItem.scss" module lang="scss"></style>
<script src="./UserSampleListItem.js"></script>

<template>
	<div :class="$style.wrap">
		<div :class="$style.fill" :style="{width: animatedFillWidth + '%'}"></div>
		<span :class="$style.content">
			<strong>{{fileName}}</strong>
			<small>{{fileSize | formatBytes}}</small>
			<small>[{{fileType}}-{{fileState}}]</small>
			<button
				v-if="fileType === FileType.USER && fileState !== FileState.REMOVING"
				@click="removeUserFile"
			>remove</button>

			<button
				v-if="fileType === FileType.BOTH && fileState === FileState.EXISTS"
				@click="upload"
			>overwrite</button>
			<button
				v-if="fileType === FileType.BOTH && fileState === FileState.EXISTS"
				@click="cancelOverwrite"
			>cancel</button>
		</span>
	</div>
</template>

