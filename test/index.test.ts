import * as grpc from '@grpc/grpc-js';
import {HealthChecker} from '../src';
import * as health_pb from '../src/pb/health_pb';

describe('HealthChecker', () => {
  const healthChecker = new HealthChecker({
    '': health_pb.HealthCheckResponse.ServingStatus.SERVING,
    'some/service': health_pb.HealthCheckResponse.ServingStatus.UNKNOWN,
  });

  it('responds whole service status', () => {
    expect(healthChecker._genResponse('')[0]).toEqual(null);
    expect(healthChecker._genResponse('')[1]?.getStatus()).toEqual(
      health_pb.HealthCheckResponse.ServingStatus.SERVING
    );
  });

  it("responds individual service's  status", () => {
    expect(healthChecker._genResponse('some/service')[0]).toEqual(null);
    expect(healthChecker._genResponse('some/service')[1]?.getStatus()).toEqual(
      health_pb.HealthCheckResponse.ServingStatus.UNKNOWN
    );
  });

  it('returns NOT_FOUND for unknown service name', () => {
    expect(healthChecker._genResponse('unknown/service')[0]?.code).toEqual(
      grpc.status.NOT_FOUND
    );
    expect(healthChecker._genResponse('unknown/service')[1]).toEqual(null);
  });
});
