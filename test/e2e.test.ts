import * as util from 'util';
import * as grpc from '@grpc/grpc-js';
import * as getPort from 'get-port';
import * as health_pb from '../src/pb/health_pb';
import * as health_grpc_pb from '../src/pb/health_grpc_pb';
import {HealthService, HealthChecker, ServingStatus} from '../src';

async function withServer(
  server: grpc.Server,
  callback: (address: string) => Promise<void>
): Promise<void> {
  const bindServerAsync = util.promisify(server.bindAsync).bind(server);
  const tryServerShutdown = util.promisify(server.tryShutdown).bind(server);

  const port = await getPort();
  const address = `0.0.0.0:${port}`;

  await bindServerAsync(address, grpc.ServerCredentials.createInsecure());
  server.start();
  await callback(address);
  return tryServerShutdown();
}

function NewHealthCheckRequest(service: string): health_pb.HealthCheckRequest {
  const request = new health_pb.HealthCheckRequest();
  request.setService(service);
  return request;
}

describe('HealthChecker#server', () => {
  it('returns valid message on requests with valid service names', async () => {
    const healthChecker = new HealthChecker({
      '': ServingStatus.SERVING,
      'some/service': ServingStatus.NOT_SERVING,
    });
    const server = new grpc.Server();
    server.addService(HealthService, healthChecker.server);

    await withServer(server, async address => {
      const client = new health_grpc_pb.HealthClient(
        address,
        grpc.credentials.createInsecure()
      );
      const doCheck = util
        .promisify<health_pb.HealthCheckRequest, health_pb.HealthCheckResponse>(
          client.check
        )
        .bind(client);

      const message1 = await doCheck(NewHealthCheckRequest(''));
      expect(message1?.getStatus()).toEqual(
        health_pb.HealthCheckResponse.ServingStatus.SERVING
      );

      const message2 = await doCheck(NewHealthCheckRequest('some/service'));
      expect(message2?.getStatus()).toEqual(
        health_pb.HealthCheckResponse.ServingStatus.NOT_SERVING
      );
    });
  });

  it('returns NOT_FOUND error on requests with service names which is not registered', async () => {
    const healthChecker = new HealthChecker({
      '': ServingStatus.SERVING,
      'some/service': ServingStatus.NOT_SERVING,
    });

    const server = new grpc.Server();
    server.addService(HealthService, healthChecker.server);

    await withServer(server, async address => {
      const client = new health_grpc_pb.HealthClient(
        address,
        grpc.credentials.createInsecure()
      );
      const doCheck = util
        .promisify<health_pb.HealthCheckRequest, health_pb.HealthCheckResponse>(
          client.check
        )
        .bind(client);

      try {
        await doCheck(NewHealthCheckRequest(''));
      } catch (err) {
        expect((err as grpc.ServiceError).code).toEqual(grpc.status.NOT_FOUND);
      }
    });
  });
});