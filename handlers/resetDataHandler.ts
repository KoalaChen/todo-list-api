import { IncomingMessage, ServerResponse } from "http";
import { UrlMethodHandler } from "../urlMethodHandler";
import { DefaultHeaders } from "../defaultHeaders";

export class ResetDataHandler implements UrlMethodHandler {
    constructor(
        private readonly resetDataFunc: () => void
    ) {
        
    }
    check(req: IncomingMessage) {
        return req.url === '/reset' && req.method === 'DELETE';
    }

    handle(req: IncomingMessage, res: ServerResponse<IncomingMessage>) {
        this.resetDataFunc();
        res.writeHead(200, DefaultHeaders.getDefaults());
        res.end();
    }
}
