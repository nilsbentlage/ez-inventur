<script lang="ts">
	import type { ListItem } from '$lib/types';
	import items from '$lib/stores/items';
	export let item: ListItem;
	export let index: number;

	import templates from '$lib/templates';
	import { confirmAction } from './utils';

	let sourceItem: HTMLElement;

	function subtract() {
		item.count--;
		if (item.count <= 0) {
			item.count = 0;
		}
	}

	function deleteItem() {
		items.update((items) => items.filter((i) => i !== item));
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		event.stopPropagation();
		// console.log('🚀 ~ handleDrop ~ event:', event);

		const dragIndex = parseInt(
			(event.dataTransfer && event.dataTransfer.getData('text/plain')) || ''
		);
		console.log('🚀 ~ handleDrop ~ dragIndex:', dragIndex);
		const target = event.target as HTMLElement;
		const dropIndex = target.dataset.index
			? parseInt(target.dataset.index || '')
			: parseInt(target.closest('li')?.dataset.index || '');
		console.log('🚀 ~ handleDrop ~ dropIndex:', dropIndex);

		if (dragIndex === dropIndex) return;

		if (dragIndex !== undefined && dropIndex !== undefined) {
			items.update((items) => {
				const newItems = [...items];
				const [dragItem] = newItems.splice(dragIndex, 1);
				newItems.splice(dropIndex, 0, dragItem);
				return newItems;
			});
		}
		target.style.outline = 'none';
	}

	function dragStart(event: DragEvent) {
		sourceItem = event.target;
		event.target.style.opacity = '0.5';
		event.dataTransfer.setData('text/plain', index);
	}

	function dragEnd(event: DragEvent) {
		event.preventDefault();
		sourceItem.style.opacity = '1';
	}

	function dragOver(event: DragEvent) {
		event.preventDefault();
		event.target.style.outline = '1px solid orange';
	}

	function dragLeave(event: DragEvent) {
		event.preventDefault();
		event.target.style.outline = 'none';
	}
</script>

<li
	draggable="true"
	on:dragstart={dragStart}
	on:dragleave={dragLeave}
	on:drop={handleDrop}
	on:dragend={dragEnd}
	on:dragover={dragOver}
	data-index={index}
>
	<div class="header">
		<div class="title">
			{item.name}
			<span class="details">
				{templates[item.type].label} ({item.size.toLocaleString()}
				{templates[item.type].unit})
			</span>
		</div>
		<button
			class="delete"
			on:click={() => confirmAction('Möchtest du diese Ware wirklich löschen?', deleteItem)}
			>✕</button
		>
	</div>
	<div class="buttons">
		<button on:click={() => subtract()}>-</button>
		<input type="number" class="count" bind:value={item.count} />
		<button on:click={() => item.count++}>+</button>
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
		border: 1px solid #fff;
		background-color: #eee;
		box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
		border-radius: 0.5rem;
		user-select: none;
	}

	button {
		pointer-events: all;
	}
	.count {
		width: clamp(2.25em, 33%, 4em);
	}
	.header {
		flex-grow: 1;
		display: flex;
		justify-content: space-between;
		width: 100%;
		white-space: nowrap;
		pointer-events: none;
	}

	.title {
		font-size: 1.25em;
		padding-block: 0.25em;
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
			justify-content: space-between;
			border-top: none;
			padding: 0;
			flex-basis: 48%;
		}
		input.count {
			border: none;
			font-size: 1em;
			text-align: right;
		}

		* {
			box-shadow: none !important;
			background-color: none !important;
			background: none !important;
		}
	}
</style>
