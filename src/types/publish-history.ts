export interface PublishHistoryEntry {
	id: number | string;
	status: string;
	date: string;
	initiatedAt?: string;
	preview?: string;
	provider?: string;
	[key: string]: unknown;
}

export interface PublishHistory {
	history: PublishHistoryEntry[];
}

export default PublishHistory;
