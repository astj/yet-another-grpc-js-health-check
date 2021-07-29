"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServingStatus = exports.HealthChecker = void 0;
const grpc = require("@grpc/grpc-js");
const health_pb = require("./pb/health_pb");
/**
 * HealthChecker provides gRPC health check implementation via #.server.
 */
class HealthChecker {
    /**
     * initializes a new HealthChecker.
     * @param statusMap: specifies initial status for each service.
     */
    constructor(statusMap) {
        this.statusMap = {};
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
    setStatus(service, status) {
        this.statusMap[service] = status;
    }
    check(call, callback) {
        const service = call.request.getService();
        const status = this.statusMap[service];
        if (status === undefined) {
            callback({ code: grpc.status.NOT_FOUND }, null);
        }
        const res = new health_pb.HealthCheckResponse();
        res.setStatus(status);
        callback(null, res);
    }
}
exports.HealthChecker = HealthChecker;
exports.ServingStatus = health_pb.HealthCheckResponse.ServingStatus;
//# sourceMappingURL=index.js.map