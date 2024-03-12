<script lang="ts">
	import { items } from '$lib/store';
	import ListItem from '$lib/ListItem.svelte';

	import templates from '$lib/templates';
	import type { Updater } from 'svelte/store';

	let newName = '';
	let newType = 'bottle';
	let newSize = 0.3;

	let sizeLabel = 'Liter';

	function addItem() {
		if (newName === '') return;
		items.update((items: Updater<ListItem[]>) => [
			...items,
			{ name: newName, count: 0, size: newSize, type: newType }
		]);
		newName = '';
		newSize = 0.3;
		newType = 'bottle';
	}

	function removeItem(item: ListItem) {
		items.update((items) => items.filter((i) => i !== item));
	}

	function changeTemplate(event: Event): string {
		const type = (event.target as HTMLSelectElement).value;
		newSize = templates[type].default;
		sizeLabel = templates[type].unit;
		return sizeLabel;
	}
</script>

<main>
	<h1>Mausi's Inventur-Liste</h1>
	<form action="" on:submit={() => addItem()}>
		<input type="text" name="new-name" id="new-name" required bind:value={newName} />

		<select id="new-type" bind:value={newType} on:change={changeTemplate}>
			{#each Object.keys(templates) as type}
				<option value={type}>{templates[type].label}</option>
			{/each}
		</select>
		<label for="new-size" id="new-size">
			Inhalt:
			<input type="number" name="new-size" min="0.1" max="30" step="0.01" bind:value={newSize} />
			{sizeLabel}</label
		>

		<button>ADD</button>
	</form>
	<ul>
		{#each $items as item}
			<ListItem bind:item on:remove={() => removeItem(item)} />
		{/each}
	</ul>
</main>

<style>
	main {
		text-align: center;
		font-family: sans-serif;
	}
	ul {
		padding: 1em 0;
		margin: 0;
	}

	form {
		display: grid;
		grid-template-columns: 3fr 2fr 1fr;
		grid-template-rows: repeat(2, 1fr);
		grid-column-gap: 0.5em;
		grid-row-gap: 0.5em;
	}

	h1 {
		font-size: 1.5em;
		padding-bottom: 1em;
		margin-bottom: 1.5em;
		border-bottom: 1px solid #ccc;
	}

	#new-name {
		grid-area: 1 / 1 / 2 / 3;
		font-size: 1.2em;
		padding: 0.25em;
	}
	#new-type {
		grid-area: 2 / 1 / 3 / 2;
		padding: 0.25em;
	}
	#new-size {
		grid-area: 2 / 2 / 3 / 3;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.5em;
		margin-right: a;
	}
	#new-size input {
		width: 3em;
		height: 100%;
		box-sizing: border-box;
		text-align: center;
	}
	button {
		grid-area: 1 / 3 / 3 / 4;
		font-size: 1.25em;
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
		main {
			font-size: 14px;
		}
		form {
			display: none;
		}
		ul {
			padding: 0;
			display: flex;
			flex-direction: row;
		}
	}
</style>
