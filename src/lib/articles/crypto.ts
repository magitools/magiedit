export function generateIv() {
	const data = new Uint8Array(16);
	crypto.getRandomValues(data);
	return data;
}
