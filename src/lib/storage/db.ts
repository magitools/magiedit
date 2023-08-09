import Dexie, { type Table } from 'dexie';

export interface Article {
	id?: number;
	title?: string;
	content?: string;
	tags: string[];
	createdAt?: Date;
	published: boolean
}

export interface Settings {
	id?: number;
	name: string;
	value: string;
}

export class MagiEditDB extends Dexie {
	// 'friends' is added by dexie when declaring the stores()
	// We just tell the typing system this is the case
	articles!: Table<Article>;
	settings!: Table<Settings>;
	constructor() {
		super('MagiEdit');
		this.version(1).stores({
			articles: '++id, title, content, tags, createdAt, published',
            settings: '++id, name, value',
		});
	}
}

export const db = new MagiEditDB();
