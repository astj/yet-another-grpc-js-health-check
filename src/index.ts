import * as grpc from '@grpc/grpc-js';
import * as health_pb from './pb/health_pb';
import * as health_grpc_pb from './pb/health_grpc_pb';

type _StatusMap = {
  [service: string]: health_pb.HealthCheckResponse.ServingStatus;
};

/**
 * Represents (initial) status for each service.
 * empty service `""` represents the status for whole server.
 */
export type StatusMap = Readonly<_StatusMap>;

/**
 * Provides gRPC health checking protocol implementation.
 *
 * @remarks
 * For information about the protocol, see https://github.com/grpc/grpc/blob/master/doc/health-checking.md
 *
 * @example
 * import { HealthChecker, healthService, servingStatus } from '@astj/grpc-js-health-check';
 * const s = new grpc.Server();
 * const healthChecker = new HealthChecker({ '': servingStatus.SERVING, 'some.service': servingStatus.NOT_SERVING })
 * s.addService(HealthService, healthChecker.server);
 * s.addService(someService, someImpl);
 * healthChecker.setStatus('some.service', servingStatus.SERVING);
 */
export class HealthChecker {
  private statusMap: _StatusMap = {};
  /**
   * Behaves as health check service implementation.
   */
  server: health_grpc_pb.IHealthServer;

  /**
   * Initializes a new HealthChecker.
   * @param statusMap - specifies initial status for each service.
   */
  constructor(statusMap: StatusMap) {
    Object.assign(this.statusMap, statusMap);
    this.server = {
      check: this.check.bind(this),
    };
  }

  /**
   * Update status for specified service.
   * @param service - target service name
   * @param status - new status
   */
  setStatus(
    service: string,
    status: health_pb.HealthCheckResponse.ServingStatus
  ): void {
    this.statusMap[service] = status;
  }

  check(
    call: grpc.ServerUnaryCall<
      health_pb.HealthCheckRequest,
      health_pb.HealthCheckResponse
    >,
    callback: grpc.sendUnaryData<health_pb.HealthCheckResponse>
  ): void {
    const service = call.request.getService();
    const [err, res] = this._genResponse(service);
    callback(err, res);
  }

  _genResponse(
    service: string
  ): [Partial<grpc.StatusObject> | null, health_pb.HealthCheckResponse | null] {
    const status = this.statusMap[service];
    if (status === undefined) {
      return [{code: grpc.status.NOT_FOUND}, null];
    }
    const res = new health_pb.HealthCheckResponse();
    res.setStatus(status);
    return [null, res];
  }
}

export const ServingStatus = health_pb.HealthCheckResponse.ServingStatus;
export const HealthService = health_grpc_pb.HealthService;
