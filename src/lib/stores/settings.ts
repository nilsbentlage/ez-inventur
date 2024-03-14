import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import { browser } from '$app/environment';

const storedSettings = browser ? JSON.parse(localStorage.getItem('settings') || '{}') : {};

const settings: Writable<{ name: string }> = writable(storedSettings);

settings.subscribe(($settings) => {
	browser ? localStorage.setItem('settings', JSON.stringify($settings)) : null;
});

export default settings;
