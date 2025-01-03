import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import type { ListItem } from '../types';
import { browser } from '$app/environment';

const demoContent = [
	{ name: "Beck's Bier", count: 3, size: 24, type: 'box' },
	{ name: "Beck's Bier", count: 11, size: 0.3, type: 'bottle' },
	{ name: 'Hackbällchen', count: 6, size: 1, type: 'bag' },
	{ name: 'Sauvignon Blanc', count: 3, size: 6, type: 'cardbox' },
	{ name: 'Servietten', count: 2, size: 100, type: 'other' }
];

const storedItems = browser
	? localStorage.getItem('items')
		? JSON.parse(localStorage.getItem('items') || '[]')
		: demoContent
	: [];

const items: Writable<ListItem[]> = writable(storedItems);

items.subscribe(($items) => {
	browser ? localStorage.setItem('items', JSON.stringify($items)) : null;
});

export default items;
