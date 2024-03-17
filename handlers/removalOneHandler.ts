import { IncomingMessage, ServerResponse } from "http";
import { UrlMethodHandler } from "../urlMethodHandler";
import { SuccessResult } from "../successResult";
import { TodoItem } from "../todoItem";

export class RemoveOneHandler implements UrlMethodHandler {
    constructor(
        private readonly getDataFunc: () => TodoItem[]
    ) {
        
    }
    check(req: IncomingMessage) {
        return !!(req.url?.match(/^\/todos\/[a-zA-Z0-9\-]+$/)) && req.method === 'DELETE';
    }

    handle(req: IncomingMessage, res: ServerResponse<IncomingMessage>) {
        const dataList = this.getDataFunc();
        const url = req.url as string;
        const id = url.split('/').pop() as string;
        const todoItem = dataList.find((todo) => todo.id === id);
        if (todoItem) {
            dataList.splice(dataList.indexOf(todoItem), 1);
        }
        const result: SuccessResult = {
            status: 'success',
            data: dataList
        };
        res.writeHead(200);
        res.end(JSON.stringify(result));
    }
}