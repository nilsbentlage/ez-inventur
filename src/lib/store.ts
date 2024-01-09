import { writable, type Writable } from 'svelte/store';
import type ListItem from './ListItem.svelte';

export const items: Writable<ListItem[]> = writable([]);
