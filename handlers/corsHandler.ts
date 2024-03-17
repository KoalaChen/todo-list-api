import * as http from 'http';
import { DefaultHeaders } from '../defaultHeaders';
import { UrlMethodHandler } from '../urlMethodHandler';

export class CorsHandler implements UrlMethodHandler{
    check(req: http.IncomingMessage) {
        return req.method === 'OPTIONS';
    }

    handle(req: http.IncomingMessage, res: http.ServerResponse) {
        res.writeHead(200, DefaultHeaders.getDefaults());
        res.end(JSON.stringify({}));
    }
}