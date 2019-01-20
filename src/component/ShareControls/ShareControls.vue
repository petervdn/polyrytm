<style src="./ShareControls.scss" module lang="scss"></style>
<script src="./ShareControls.js"></script>

<template>
	<div class="controls-wrapper">
		<p class="info">
			Save and share your creation for others to enjoy! All sequences will be stored, along with the visual settings.
		</p>
		<div>
			<div>
				<label>project name</label><input :value="name" @input="onNameInputUpdate" />
			</div>
			<div>
				<label>author name</label><input :value="author" @input="onAuthorInputUpdate" />
			</div>
			<div>
				<label>link</label><input :value="link" @input="onLinkInputUpdate" />
			</div>
		</div>
		<div>
			<button @click="save">save</button>
		</div>

	</div>
</template>

