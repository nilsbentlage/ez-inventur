<script lang="ts">
	import items from '$lib/stores/items';
	import settings from '$lib/stores/settings';

	import ListItem from '$lib/ListItem.svelte';

	import type { ListItem as ListItemType } from '$lib/types';

	import templates from '$lib/templates';

	let newName = '';
	let newType = 'bottle';
	let newSize = 0.3;

	let sizeLabel = 'Liter';

	let newItemDialog: HTMLDialogElement;

	function addItem(event: Event) {
		event.preventDefault();
		if (newName === '') return;
		items.update((items) => [...items, { name: newName, count: 0, size: newSize, type: newType }]);
		newName = '';
		newSize = 0.3;
		newType = 'bottle';
		newItemDialog.close();
	}

	function removeItem(item: ListItemType) {
		items.update((items) => items.filter((i: ListItemType) => i !== item));
	}

	function changeTemplate(event: Event): string {
		const type = (event.target as HTMLSelectElement).value;
		newSize = templates[type].default;
		sizeLabel = templates[type].unit;
		return sizeLabel;
	}

	const date = () => {
		const now = new Date();
		const date = now.toLocaleDateString('de-DE', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
		const time = now.toLocaleTimeString('de-DE', {
			hour: '2-digit',
			minute: '2-digit'
		});
		return `${date} - ${time}`;
	};

	function deleteAll() {
		items.set([]);
	}

	function resetAll() {
		items.update((items) => items.map((i) => ({ ...i, count: 0 })));
	}
</script>

<main>
	<header>
		<h1>EZ Inventur</h1>
		<span class="timestamp">{date()} - {$settings.name}</span>
	</header>
	{#if $items.length === 0}
		<p>Keine Items vorhanden</p>
	{/if}
	<ul>
		{#each $items as item}
			<ListItem bind:item on:remove={() => removeItem(item)} />
		{/each}
	</ul>
	<button class="add-button hide-on-paper" on:click={() => newItemDialog.showModal()}>Neue Ware hinzufügen</button
	>
	<dialog bind:this={newItemDialog}>
		<section>
			<h2>Neue Ware hinzufügen</h2>
			<form action="" on:submit={addItem}>
				<input type="text" name="new-name" id="new-name" required bind:value={newName} />
				<select id="new-type" bind:value={newType} on:change={changeTemplate}>
					{#each Object.keys(templates) as type}
						<option value={type}>{templates[type].label}</option>
					{/each}
				</select>
				<label for="new-size" id="new-size">
					Inhalt:
					<input
						type="number"
						name="new-size"
						min="0.1"
						max="30"
						step="0.01"
						bind:value={newSize}
					/>
					{sizeLabel}</label
				>

				<button type="button" class="close" on:click={() => newItemDialog.close()}>✕</button>
				<button type="submit">OK</button>
			</form>
		</section>
	</dialog>
	<details>
		<summary>Einstellungen</summary>
		<section class="actions">
			<h2>Dein Name</h2>
			<input type="text" name="name" bind:value={$settings.name} />
		</section>
		<section class="actions">
			<h2>Aktionen</h2>
			<button on:click={deleteAll}> Alle Items löschen </button>
			<button on:click={resetAll}> Alle Items zurücksetzen </button>
		</section>
	</details>
	<span class="darken"></span>
</main>

<style>
	* {
		box-sizing: border-box;
	}
	.actions {
		margin-top: 1em;
	}
	.actions > button {
		margin-block: 0.25em;
		padding-block: 0.25em;
		width: 100%;
	}
	main {
		text-align: center;
		font-family: sans-serif;
		font-size: large;
		position: relative;
		margin-inline: 1rem;
		padding-bottom: 6rem;
	}

	h1 {
		font-size: 1.5em;
	}
	h2 {
		font-size: 1.25em;
		margin-block: 0.5em;
		padding-top: 0;
		border-top: #ccc 1px solid;
	}
	section:first-of-type > h2 {
		border-top: none;
	}
	ul {
		padding: 0;
		margin: 0;
		padding-bottom: 2rem;
	}

	form {
		display: grid;
		grid-template-columns: auto, auto;
		grid-template-rows: repeat(3, 1fr);
		grid-column-gap: 0.5em;
		grid-row-gap: 0.5em;
	}

	header {
		margin-bottom: 0.5em;
		border-bottom: 1px solid #ccc;
	}
	input,
	select {
		padding: 0.5em;
	}
	[name='name'] {
		display: block;
		width: -webkit-fill-available;
	}

	#new-name {
		grid-area: 1 / 1 / 2 / 4;
	}
	#new-type {
		grid-area: 2 / 1 / 3 / 2;
	}
	#new-size {
		grid-area: 2 / 2 / 3 / 4;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.5em;
		margin-right: a;
	}

	button[type='submit'] {
		grid-area: 3 / 1 / 3 / 3;
		font-size: 1.25em;
		line-height: 1.5;
	}

	.close {
		grid-area: 3 / 3 / 3 / 4;
		aspect-ratio: 1;
		font-size: 1.25em;
		line-height: 1.5;
	}

	.add-button {
		font-size: 1.25em;
		padding: 0.5em 1em;
		border: none;
		border-radius: 0.4em;
	}

	dialog {
		border: none;
	}
	dialog::backdrop {
		background-color: rgba(0, 0, 0, 0.5);
	}
	#new-size input {
		width: 3em;
		height: 100%;
		box-sizing: border-box;
		text-align: center;
	}

	input[type='number']::-webkit-outer-spin-button,
	input[type='number']::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
	input[type='number'] {
		-moz-appearance: textfield;
	}

	.timestamp {
		font-size: 0.75em;
		font-weight: normal;
		position: relative;
		top: -1.25em;
		display: none;
	}

	details {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		padding: 1rem;
		background-color: white;
		box-shadow: 0 -5px 10px rgba(0, 0, 0, 0.2);
		border-radius: 0.5rem 0.5rem 0 0;
		z-index: 1;
	}
	summary {
		font-weight: bold;
		cursor: pointer;
		margin-right: auto;
		text-align: left;
	}

	@media print {
		main {
			font-size: 14px;
			padding-inline: 2em;
		}
		* {
			box-shadow: none !important;
			background-color: none !important;
			background: none !important;
		}
		details {
			display: none;
		}
		ul {
			padding: 0;
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: space-between;
		}
		.timestamp {
			display: inline;
		}
		.hide-on-paper {
			display: none;
		}
	}
	span.darken {
		position: fixed;
		z-index: 0;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
		opacity: 0;
		transition: opacity 0.5s;
		pointer-events: none;
	}
	details[open] + span.darken {
		opacity: 1;
		pointer-events: all;
	}
</style>
