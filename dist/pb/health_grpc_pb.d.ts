export namespace HealthService {
    namespace check {
        export const path: string;
        export const requestStream: boolean;
        export const responseStream: boolean;
        export const requestType: typeof health_pb.HealthCheckRequest;
        export const responseType: typeof health_pb.HealthCheckResponse;
        export { serialize_grpc_health_v1_HealthCheckRequest as requestSerialize };
        export { deserialize_grpc_health_v1_HealthCheckRequest as requestDeserialize };
        export { serialize_grpc_health_v1_HealthCheckResponse as responseSerialize };
        export { deserialize_grpc_health_v1_HealthCheckResponse as responseDeserialize };
    }
}
export var HealthClient: import("@grpc/grpc-js/build/src/make-client").ServiceClientConstructor;
import health_pb = require("./health_pb.js");
declare function serialize_grpc_health_v1_HealthCheckRequest(arg: any): Buffer;
declare function deserialize_grpc_health_v1_HealthCheckRequest(buffer_arg: any): health_pb.HealthCheckRequest;
declare function serialize_grpc_health_v1_HealthCheckResponse(arg: any): Buffer;
declare function deserialize_grpc_health_v1_HealthCheckResponse(buffer_arg: any): health_pb.HealthCheckResponse;
export {};
