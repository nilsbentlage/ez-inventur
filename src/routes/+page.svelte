<script lang="ts">
	import items from '$lib/stores/items';
	import settings from '$lib/stores/settings';

	import ListItem from '$lib/ListItem.svelte';

	import templates from '$lib/templates';
	import type { Updater } from 'svelte/store';

	let newName = '';
	let newType = 'bottle';
	let newSize = 0.3;

	let sizeLabel = 'Liter';

	let yourName = $settings.name;

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
	<details>
		<summary>Einstellungen</summary>
		<section>
			<h2>Neues Item hinzufügen</h2>
			<form action="" on:submit={() => addItem()}>
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

				<button>ADD</button>
			</form>
		</section>
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
	}

	h1 {
		font-size: 1.5em;
	}
	h2 {
		font-size: 1.25em;
		margin-block: 0.5em;
		padding-top: 0.8em;
		border-top: #ccc 1px solid;
	}
	section:first-of-type > h2 {
		border-top: none;
	}
	ul {
		padding: 0;
		margin: 0;
		padding-bottom: 4rem;
	}

	form {
		display: grid;
		grid-template-columns: 3fr 2fr 1fr;
		grid-template-rows: repeat(2, 1fr);
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
		grid-area: 1 / 1 / 2 / 3;
	}
	#new-type {
		grid-area: 2 / 1 / 3 / 2;
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
		border: 1px solid red;
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
	}
</style>
