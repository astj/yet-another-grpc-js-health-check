# @astj/grpc-js-health-check

Yet another [GRPC Health Checking Protocol](https://github.com/grpc/grpc/blob/master/doc/health-checking.md) server implementation for [@grpc/grpc-js](https://www.npmjs.com/package/@grpc/grpc-js).

This implementation is made as @astj's hobby, and maybe you should use [grpc-js-health-check](https://www.npmjs.com/package/grpc-js-health-check) in most cases.

## Features

- Implements necessary methods for [grpc_health_probe](https://github.com/grpc-ecosystem/grpc-health-probe)
  - In other words, `Watch` is not implemented
- Works with [@grpc/grpc-js](https://www.npmjs.com/package/@grpc/grpc-js)
- Fully written with TypeScript and static code generation

## Usage

```typescript
import * as grpc from '@grpc/grpc-js';
import { HealthChecker, HealthService, ServingStatus } from '@astj/grpc-js-health-check';

const healthChecker = new HealthChecker({
  '': ServingStatus.SERVING,
  'some/service': ServingStatus.NOT_SERVING,
});
const server = new grpc.Server();
server.addService(HealthService, healthChecker.server);

// If you'd like to change status afterwards:
healthChecker.setStatus('some/service', ServingStatus.SERVING);
```

## License

Apache 2.0
