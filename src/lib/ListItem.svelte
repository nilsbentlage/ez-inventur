<script lang="ts">
	import type { ListItem } from '$lib/types';
	import items from '$lib/stores/items';
	export let item: ListItem;

	import templates from '$lib/templates';

	let showModal = false;

	function subtract() {
		item.count--;
		if (item.count <= 0) {
			item.count = 0;
		}
	}

	function deleteItem() {
		items.update((items: ListItem[]) => items.filter((i) => i !== item));
		showModal = false;
	}

	function toggleModal() {
		showModal = !showModal;
	}
</script>

<li>
	<div class="header">
		<div class="title">
			{item.name}
			<span class="details">
				{templates[item.type].label} ({item.size}
				{templates[item.type].unit})
			</span>
		</div>
		<button class="delete" on:click={() => (showModal = true)}>✕</button>
	</div>
	<div class="buttons">
		<button on:click={() => subtract()}>-</button>
		<input type="number" class="count" bind:value={item.count} />
		<button on:click={() => item.count++}>+</button>
	</div>
	<div class="modal" class:hidden={!showModal} on:click={toggleModal}>
		<div class="modal-content">
			<div class="modal-text">
				<p>Möchtest du das Item wirklich löschen?</p>
			</div>
			<div class="modal-buttons">
				<button on:click|stopPropagation={deleteItem} class="confirm">Löschen</button>
				<button on:click|stopPropagation={toggleModal} class="cancel">Abbrechen</button>
			</div>
		</div>
	</div>
</li>

<style>
	li {
		display: flex;
		flex-direction: column;
		align-items: center;
		list-style-type: none;
		margin: 0.5em 0 0;
		padding: 0.5em 1em;
		border: 1px solid #ccc;
	}
	.count {
		width: 2.25em;
	}
	.header {
		flex-grow: 1;
		display: flex;
		justify-content: space-between;
		width: 100%;
	}

	.title {
		font-size: 1.25em;
		padding-block: 0.5em;
	}
	.details {
		font-size: 0.6em;
		color: #555;
		margin-left: 1em;
	}

	.buttons > button {
		aspect-ratio: 1;
		width: 2.25em;
		height: auto;
		display: inline-block;
	}

	.delete {
		background-color: transparent;
		border: none;
		color: #555;
		font-size: 1.5em;
		padding: 0;
		cursor: pointer;
	}

	.buttons > button,
	.buttons > input {
		padding: 0.5em;
		font-size: 1.5em;
		text-align: center;
		cursor: pointer;
		box-sizing: border-box;
	}

	.modal {
		position: fixed;
		z-index: 1;
		inset: 0;
		background-color: rgb(0, 0, 0);
		background-color: rgba(0, 0, 0, 0.4);
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.modal.hidden {
		display: none;
	}

	.modal-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		list-style-type: none;
		margin: 0.5em 0 0;
		padding: 1em;
		border-bottom: 1px solid #ccc;
		background-color: white;
		box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.2);
	}
	.modal-buttons > button {
		margin: 0 0.5em;
		padding: 0.5em 1em;
	}
	input[type='number']::-webkit-outer-spin-button,
	input[type='number']::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
	input[type='number'] {
		-moz-appearance: textfield;
	}

	@media print {
		button,
		.buttons > button {
			display: none;
		}
		li {
			flex-direction: row;
			border-inline: none;
			margin-top: 0;
			border-top: none;
			padding: 0;
			flex-basis: 48%;
		}
		input.count {
			border: none;
			font-size: 1em;
		}
	}
</style>
