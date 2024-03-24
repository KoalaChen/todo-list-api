import { IncomingMessage, ServerResponse } from "http";
import { UrlMethodHandler } from "../urlMethodHandler";
import { SuccessResult } from "../successResult";
import { DefaultHeaders } from "../defaultHeaders";

/** 移除所有待辦 */
export class RemoveAllHandler implements UrlMethodHandler {
    constructor(
        private readonly removeAllFunc: () => void
    ) {
        
    }
    check(req: IncomingMessage) {
        return req.url === '/todos/removeAll' && req.method === 'DELETE';
    }

    handle(req: IncomingMessage, res: ServerResponse<IncomingMessage>) {
        this.removeAllFunc();
        const result: SuccessResult = {
            status: 'success',
            data: []
        };
        res.writeHead(200, DefaultHeaders.getDefaults());
        res.end(JSON.stringify(result));
    }
}