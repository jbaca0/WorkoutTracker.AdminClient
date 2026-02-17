import type LogEntry from '../Common/LogEntry';

export default interface GetLogsResponse {
    logs: LogEntry[];
    totalCount: number;
}
