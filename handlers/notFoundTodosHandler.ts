import { DefaultHeaders } from "../defaultHeaders";
import { UrlMethodHandler } from "../urlMethodHandler";
import * as http from 'http';

/** 若網址錯誤 */
export class NotFoundTodoHandler implements UrlMethodHandler {
    check(req: http.IncomingMessage): boolean {
        return true;
    }

    handle(request: http.IncomingMessage, response: http.ServerResponse): void {
        response.writeHead(404, DefaultHeaders.getDefaults());
        response.write(JSON.stringify({
            status: "error",
            message: "Not found"
        }));
        response.end();
    }
}