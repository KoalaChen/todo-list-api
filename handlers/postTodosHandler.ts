import { DefaultHeaders } from "../defaultHeaders";
import { SuccessResult } from "../successResult";
import { TodoItem } from "../todoItem";
import { UrlMethodHandler } from "../urlMethodHandler";
import * as http from 'http';
import * as uuid from 'uuid';
import * as requestUtil from '../requestUtil';
import { NewTodo } from "../newTodo";
import { ErrorResult } from "../errorResult";

/** 新增待辦 */
export class PostTodosHandler implements UrlMethodHandler {
    constructor(
        private readonly getDataFunc: () => TodoItem[]
    ) {
        
    }
    check(req: http.IncomingMessage): boolean {
        return req.url === '/todos' && req.method === 'POST';
    }

    handle(request: http.IncomingMessage, response: http.ServerResponse): void {
        requestUtil.createResquestBodyPromise(request).then((body) => {
            console.log('POST body', body);
            try {
                const successResult = this.handleBody(body);
                response.writeHead(200, DefaultHeaders.getDefaults());
                response.write(JSON.stringify(successResult));
            } catch (error) {
                this.handleError(error, response);
            }
            response.end();
        }).catch((error) => {
            this.handleError(error, response);
        });
    }
    private handleBody(body: string): SuccessResult {
        const newTodo: NewTodo = JSON.parse(body);
        if (!newTodo) {
            throw new Error('資料不應為空值');
        }
        if (!newTodo.title) {
            throw new Error('title 欄位未填寫');
        }
        const todo: TodoItem = {
            id: uuid.v4(),
            title: newTodo.title,
            completed: false
        };
        const data = this.getDataFunc();
        data.push(todo);
        return {
            status: "success",
            data
        };

    }
    private handleError(error: unknown, response: http.ServerResponse) {
        console.error('POST 解析失敗', error);
        response.writeHead(400, DefaultHeaders.getDefaults());
        const errorResult: ErrorResult = {
            status: "error",
            message: "欄位未填寫正確"
        };
        response.write(JSON.stringify(errorResult));
    }
}