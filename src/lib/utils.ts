export function confirmAction(hint: string, cb: () => void) {
	const permission = confirm(hint);
	if (permission) {
		cb();
	}
}
