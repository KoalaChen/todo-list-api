import * as http from 'http';
import { createResquestBodyPromise } from '../requestUtil';
import { UrlMethodHandler } from '../urlMethodHandler';
import { TodoItem } from '../todoItem';
import { ErrorResult } from '../errorResult';
export class UpdateTodoHandler implements UrlMethodHandler {
    constructor(
        private readonly getTodoFunc: () => TodoItem[]
    ) {
        
    }
    check(req: http.IncomingMessage) {
        return !!(req.url?.match(/^\/todos\/[a-zA-Z0-9\-]+$/)) && req.method === 'PATCH';
    }

    async handle(req: http.IncomingMessage, res: http.ServerResponse) {
        const url = req.url as string;
        const id = url.split('/').pop() as string;
        const body = await createResquestBodyPromise(req);
        let content : Partial<TodoItem> | null = null;
        console.log(`PATCH[${id}]更新`);
        const todoData = this.getTodoFunc().find((todo) => todo.id === id);
        if (!todoData) {
            res.writeHead(404);
            const errorResult: ErrorResult = {
                status: "error",
                message: "找不到資料"
            };
            res.end(JSON.stringify(errorResult));
            return;
        }
        try {
            content = JSON.parse(body);
        } catch (error) {
            console.error(`PATCH[${id}]解析失敗`, error);
            res.writeHead(400);
            const errorResult: ErrorResult = {
                status: "error",
                message: "欄位未填寫正確"
            };
            res.end(JSON.stringify(errorResult));
            return;
        }
        if (!content) {
            res.writeHead(400);
            const errorResult: ErrorResult = {
                status: "error",
                message: "欄位未填寫正確"
            };
            res.end(JSON.stringify(errorResult));
            return;
        }
        if (!content.title) {
            res.writeHead(400);
            const errorResult: ErrorResult = {
                status: "error",
                message: "欄位未填寫正確"
            };
            res.end(JSON.stringify(errorResult));
            return;
        }

        todoData.title = content.title || todoData.title;
        todoData.completed = typeof(content.completed) === 'boolean' ? content.completed : todoData.completed;
        res.writeHead(200);
        res.write
        res.end(JSON.stringify(todoData));
    }
}