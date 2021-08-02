import * as grpc from '@grpc/grpc-js';
import {HealthChecker, ServingStatus} from '../src';
import * as health_pb from '../src/pb/health_pb';

describe('HealthChecker', () => {
  const healthChecker = new HealthChecker({
    '': ServingStatus.SERVING,
    'some/service': ServingStatus.UNKNOWN,
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

  it('updates status by setStatus', () => {
    const healthChecker = new HealthChecker({
      '': ServingStatus.UNKNOWN,
      'some/service': ServingStatus.NOT_SERVING,
      'another/service': ServingStatus.NOT_SERVING,
    });

    expect(healthChecker._genResponse('')[1]?.getStatus()).toEqual(
      health_pb.HealthCheckResponse.ServingStatus.UNKNOWN
    );
    expect(healthChecker._genResponse('some/service')[1]?.getStatus()).toEqual(
      health_pb.HealthCheckResponse.ServingStatus.NOT_SERVING
    );
    expect(
      healthChecker._genResponse('another/service')[1]?.getStatus()
    ).toEqual(health_pb.HealthCheckResponse.ServingStatus.NOT_SERVING);

    healthChecker.setStatus('some/service', ServingStatus.SERVING);

    // updates status for specified service
    expect(healthChecker._genResponse('some/service')[1]?.getStatus()).toEqual(
      health_pb.HealthCheckResponse.ServingStatus.SERVING
    );

    // does not affect on other services
    expect(healthChecker._genResponse('')[1]?.getStatus()).toEqual(
      health_pb.HealthCheckResponse.ServingStatus.UNKNOWN
    );
    expect(
      healthChecker._genResponse('another/service')[1]?.getStatus()
    ).toEqual(health_pb.HealthCheckResponse.ServingStatus.NOT_SERVING);

    healthChecker.setStatus('', ServingStatus.SERVING);

    // updates status for whole server.
    expect(healthChecker._genResponse('')[1]?.getStatus()).toEqual(
      health_pb.HealthCheckResponse.ServingStatus.SERVING
    );

    // does not affect on other services
    expect(healthChecker._genResponse('some/service')[1]?.getStatus()).toEqual(
      health_pb.HealthCheckResponse.ServingStatus.SERVING
    );

    expect(
      healthChecker._genResponse('another/service')[1]?.getStatus()
    ).toEqual(health_pb.HealthCheckResponse.ServingStatus.NOT_SERVING);
  });
});
