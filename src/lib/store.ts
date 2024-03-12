import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import type ListItem from './ListItem.svelte';
import { browser } from '$app/environment';

const storedItems = (browser && JSON.parse(localStorage.getItem('items') || '')) || [];

export const items: Writable<ListItem[]> = writable(storedItems);

items.subscribe(($items) => {
	browser && localStorage.setItem('items', JSON.stringify($items));
});
