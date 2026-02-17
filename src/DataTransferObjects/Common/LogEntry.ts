export default interface LogEntry {
    id: string;
    timestamp: string;
    logLevel: string;
    category: string;
    message: string;
    exception: string | null;
}
