<script lang="ts">
	import items from '$lib/stores/items';
	import settings from '$lib/stores/settings';

	import { confirmAction } from '$lib/utils';

	import ListItem from '$lib/ListItem.svelte';

	import type { ListItem as ListItemType } from '$lib/types';

	import templates from '$lib/templates';
	import { onMount } from 'svelte';

	let newName = '';
	let newType = 'bottle';
	let newSize = 0.3;
	let sizeLabel = 'Liter';

	let newItemDialog: HTMLDialogElement;
	let thisDetails: HTMLDetailsElement;

	function addItem(event: Event) {
		event.preventDefault();
		if (newName === '') return;
		items.update((items) => [...items, { name: newName, count: 0, size: newSize, type: newType }]);
		newName = '';
		newSize = 0.3;
		newType = 'bottle';
		sizeLabel = 'Liter';
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
		thisDetails.open = false;
	}

	function resetAll() {
		items.update((items) => items.map((i) => ({ ...i, count: 0 })));
		thisDetails.open = false;
	}

	onMount(() => {
		if ($settings.name === '' || !$settings.name) {
			$settings.name =
				prompt(
					'Auf dem Ausdruck der Inventurliste erscheint dein Name und das aktuelle Datum. Du kannst deinen Namen jetzt eingeben und ihn jederzeit in den Einstellungen anpassen.\n\nDein Name wird ausschließlich in deinem Browser gespeichert.'
				) || 'Unbekannt';
		}
		localStorage.getItem('firstVisit') ||
			(confirm(
				'Willkommen! Da du heute zum ersten Mal hier bist, habe ich dir etwas Demo-Content hinterlasse.\n\nDu solltest die angelegte Liste als CSV exportieren, damit du die für den Import erwartete Struktur verstehst.\n\nKlicke OK wenn dieser Hinweis in Zukunft NICHT angezeigt werden soll!'
			) &&
				localStorage.setItem('firstVisit', 'true'));
	});

	function exportAs(format: 'csv' | 'mail' = 'csv'): void {
		let csv = 'Name;Anzahl;Inhalt;Einheit;Typ\n';
		csv += $items
			.map(
				(item) =>
					`${item.name};${item.count};${item.size.toLocaleString()};${templates[item.type].unit};${templates[item.type].label}`
			)
			.join('\n');
		const blob = new Blob([csv], { type: 'text/csv' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		if (format === 'csv') {
			a.href = url;
			a.download = 'inventur.csv';
		} else if (format === 'mail') {
			a.target = '_blank';
			a.href = `mailto:?subject=Inventur am ${date()}&body=${encodeURIComponent(csv)}`;
		}
		a.click();
		URL.revokeObjectURL(url);
	}

	function print() {
		window.print();
	}

	function importCsv() {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = '.csv';
		input.onchange = async () => {
			const file = input.files && input.files[0];
			if (!file) return;
			try {
				const text = await file.text();
				const lines = text.split('\n');
				function getTypeTemplate(key: string): string {
					return Object.keys(templates).find((type) => templates[type].label === key) || 'bottle';
				}
				const newItems = lines
					.slice(1)
					.map((line) => {
						const [name, count, size, unit, type] = line.split(';');
						return {
							name,
							count: parseInt(count),
							size: parseFloat(size),
							type: getTypeTemplate(type)
						};
					})
					.filter((item) => item.name !== '');
				items.update((items) => [...items, ...newItems]);
			} catch (error) {
				alert('Datei konnte nicht importiert werden: ' + error);
			}
			thisDetails.open = false;
		};
		input.click();
	}
</script>

<main>
	<header>
		<h1>EZ Inventur</h1>
		<span class="timestamp">{date()} - {$settings.name}</span>
	</header>
	{#if $items.length === 0}
		<p>Keine Waren vorhanden</p>
	{/if}
	<ul>
		{#each $items as item, index}
			<ListItem bind:item on:remove={() => removeItem(item)} {index} />
		{/each}
	</ul>
	<button class="add-button hide-on-paper" on:click={() => newItemDialog.showModal()}
		>+ Neue Ware hinzufügen</button
	>
	<dialog bind:this={newItemDialog}>
		<section>
			<h2>Neue Ware hinzufügen</h2>
			<form action="" on:submit={addItem}>
				<input
					type="text"
					name="new-name"
					id="new-name"
					required
					bind:value={newName}
					placeholder="Was möchtest du zählen?"
				/>
				<div class="flex-row">
					<select
						id="new-type"
						bind:value={newType}
						on:change={changeTemplate}
						style="flex: 1 1 50%"
					>
						{#each Object.keys(templates) as type}
							<option value={type}>{templates[type].label}</option>
						{/each}
					</select>
					<label for="new-size" id="new-size" style="flex: 1 1 50%">
						<input
							type="number"
							name="new-size"
							min="0.1"
							max="200"
							step="0.01"
							bind:value={newSize}
						/>
						{sizeLabel}</label
					>
				</div>
				<div class="flex-row">
					<button type="submit">Anlegen</button>
					<button type="button" class="close" on:click={() => newItemDialog.close()}
						>Abbrechen</button
					>
				</div>
			</form>
		</section>
	</dialog>
	<details bind:this={thisDetails}>
		<summary>Einstellungen</summary>
		<section class="actions">
			<h2>Dein Name</h2>
			<input type="text" name="name" bind:value={$settings.name} />
		</section>
		<section class="actions">
			<h2>Aktionen</h2>
			<button on:click={() => confirmAction('Möchtest du wirklich alle Waren löschen?', deleteAll)}>
				Alle Waren löschen
			</button>
			<button
				on:click={() =>
					confirmAction('Möchtest du wirklich alle Zähler auf 0 zurücksetzen?', resetAll)}
			>
				Alle Zähler zurücksetzen
			</button>
		</section>
		<section class="actions">
			<h2>Import</h2>
			<button on:click={() => importCsv()}>CSV importieren</button>
		</section>
		<section class="actions">
			<h2>Export</h2>
			<button on:click={() => exportAs('csv')}>Als CSV herunterladen</button>
			<button on:click={() => exportAs('mail')}>Per E-Mail versenden</button>
			<button on:click={() => print()}>Drucken</button>
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
	button {
		cursor: pointer;
		font-size: 1em;
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
		margin-bottom: 0.5em;
		padding-top: 0.5em;
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
		display: flex;
		flex-direction: column;
		gap: 0.75em;
	}

	header {
		margin-bottom: 0.5em;
		border-bottom: 1px solid #ccc;
	}
	input,
	select {
		padding: 0.5em;
		font-size: 1em;
	}
	[name='name'] {
		display: block;
		width: -webkit-fill-available;
	}
	#new-size {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		gap: 0.5em;
		margin-right: auto;
	}

	.flex-row {
		display: flex;
		justify-content: space-between;
		gap: 0.5em;
	}

	dialog button {
		line-height: 1.5;
		flex-basis: 50%;
	}

	.add-button {
		font-size: 1.25em;
		margin: 0.5em 0 0;
		padding: 0.5em 1em;
		border: 2px dashed #999;
		stroke-dasharray: 1rem, 1rem;
		background-color: #eee;
		border-radius: 0.4em;
		width: 100%;
		color: #999;
	}

	dialog {
		border: none;
		width: clamp(20ch, 90%, 50ch);
		border-radius: 0.25rem;
	}
	dialog::backdrop {
		background-color: rgba(0, 0, 0, 0.5);
	}
	dialog h2 {
		margin-top: 0;
		padding-top: 0;
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
		max-height: 100svh;
		overflow-y: auto;
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
