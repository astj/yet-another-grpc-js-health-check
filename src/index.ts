import * as grpc from '@grpc/grpc-js';
import * as health_pb from './pb/health_pb';
import * as health_grpc_pb from './pb/health_grpc_pb';

type _StatusMap = {
  [service: string]: health_pb.HealthCheckResponse.ServingStatus;
};

/**
 * represents (initial) status for each service.
 * empty service `""` represents the status for whole server.
 */
export type StatusMap = Readonly<_StatusMap>;

/**
 * HealthChecker provides gRPC health check implementation via #.server.
 */
export class HealthChecker {
  private statusMap: _StatusMap = {};
  server: health_grpc_pb.IHealthServer;

  /**
   * initializes a new HealthChecker.
   * @param statusMap: specifies initial status for each service.
   */
  constructor(statusMap: StatusMap) {
    Object.assign(this.statusMap, statusMap);
    this.server = {
      check: this.check.bind(this),
    };
  }

  /**
   * Update status for specified service.
   * @param service target service name
   * @param status new status
   */
  setStatus(
    service: string,
    status: health_pb.HealthCheckResponse.ServingStatus
  ): void {
    this.statusMap[service] = status;
  }

  private check(
    call: grpc.ServerUnaryCall<
      health_pb.HealthCheckRequest,
      health_pb.HealthCheckResponse
    >,
    callback: grpc.sendUnaryData<health_pb.HealthCheckResponse>
  ): void {
    const service = call.request.getService();
    const status = this.statusMap[service];
    if (status === undefined) {
      callback({code: grpc.status.NOT_FOUND}, null);
    }
    const res = new health_pb.HealthCheckResponse();
    res.setStatus(status);
    callback(null, res);
  }
}

export const ServingStatus = health_pb.HealthCheckResponse.ServingStatus;
