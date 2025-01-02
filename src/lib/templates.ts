const templates: {
	[key: string]: { label: string; unit: string; default: number };
} = {
	bottle: { label: 'Flasche', unit: 'Liter', default: 0.3 },
	box: { label: 'Kiste', unit: 'Flaschen', default: 24 },
	cardbox: { label: 'Karton', unit: 'Stück', default: 6 },
	bag: { label: 'Beutel', unit: 'Portionen', default: 1 },
	other: { label: 'Sonstiges', unit: 'Stück', default: 1 }
};

export default templates;
