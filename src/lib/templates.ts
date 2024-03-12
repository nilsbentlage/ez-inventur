const templates: {
	[key: string]: { label: string; unit: string; default: number };
} = {
	bottle: { label: 'Flasche', unit: 'Liter', default: 0.3 },
	box: { label: 'Kiste', unit: 'Flaschen', default: 6 },
	cardbox: { label: 'Karton', unit: 'Stück', default: 20 },
	bag: { label: 'Beutel', unit: 'Portionen', default: 1 },
	other: { label: 'Sonstiges', unit: 'Stück', default: 1 }
};

export default templates;
