import { DefaultHeaders } from "../defaultHeaders";
import { SuccessResult } from "../successResult";
import { TodoItem } from "../todoItem";
import { UrlMethodHandler } from "../urlMethodHandler";
import * as http from 'http'; // Import the 'http' module

/** 取得所有待辦 */
export class GetTodosHandler implements UrlMethodHandler {
    constructor(
        private readonly getTodosFunc:() => readonly TodoItem[]) {
    }
    check(req: http.IncomingMessage): boolean {
        return req.url === '/todos' && req.method === 'GET';
    }
    handle(request: http.IncomingMessage, response: http.ServerResponse): void {
        response.writeHead(200, DefaultHeaders.getDefaults());
        const successResult: SuccessResult = {
            status: "success",
            data: this.getTodosFunc()
        };
        response.write(JSON.stringify(successResult));
        response.end();
    }
}