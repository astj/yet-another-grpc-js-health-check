import * as health_pb from './pb/health_pb';
import * as health_grpc_pb from './pb/health_grpc_pb';
declare type _StatusMap = {
    [service: string]: health_pb.HealthCheckResponse.ServingStatus;
};
/**
 * represents (initial) status for each service.
 * empty service `""` represents the status for whole server.
 */
export declare type StatusMap = Readonly<_StatusMap>;
/**
 * HealthChecker provides gRPC health check implementation via #.server.
 */
export declare class HealthChecker {
    private statusMap;
    server: health_grpc_pb.IHealthServer;
    /**
     * initializes a new HealthChecker.
     * @param statusMap: specifies initial status for each service.
     */
    constructor(statusMap: StatusMap);
    /**
     * Update status for specified service.
     * @param service target service name
     * @param status new status
     */
    setStatus(service: string, status: health_pb.HealthCheckResponse.ServingStatus): void;
    private check;
}
export declare const ServingStatus: typeof health_pb.HealthCheckResponse.ServingStatus;
export {};
