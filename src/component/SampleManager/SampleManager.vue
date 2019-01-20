<style src="./SampleManager.scss" module lang="scss"></style>
<script src="./SampleManager.js"></script>

<template>
	<div>
		<h2 v-if="!isPublic">
			your samples
			<small>(used {{usedSize | formatBytes}} of {{maxSize | formatBytes}})</small>
		</h2>
		<h2 v-else>
			public samples
			<small>({{usedSize | formatBytes}})</small>
		</h2>
		<StorageSpace
			v-if="!isPublic"
			:used="usedSize"
			:max="maxSize"
		></StorageSpace>

		<p :class="$style.empty" v-if="fileNames.length === 0">Nothing here yet...</p>

		<UserSampleListItem
			v-for="fileName in fileNames"
			:fileName="fileName"
			:userFile="userFiles.find(file => file.name === fileName)"
			:uploadFile="uploadFiles.find(file => file.name === fileName)"
			:key="fileName"
			:isPublic="isPublic"
			@fileUploaded="onFileUploaded"
			@stateChange="onSampleStateChange"
			ref="listItem"
		></UserSampleListItem>
		<div :class="$style.add">
			<input
				@change="onFileSelectionChange"
				type="file"
				multiple
				ref="fileSelect"
				name="sample"
				v-show="false"
			>

			<button
				@click="addSamples"
				v-if="uploadEnabled"
			>add samples</button>
		</div>
	</div>
</template>

