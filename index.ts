import * as http from 'http';
import { UrlMethodHandler } from './urlMethodHandler';
import { TodoItem } from './todoItem';
import { GetTodosHandler } from './handlers/getTodosHandler';
import { NotFoundTodoHandler } from './handlers/notFoundTodosHandler';
import { PostTodosHandler } from './handlers/postTodosHandler';
import { ResetDataHandler } from './handlers/resetDataHandler';
import { RemoveAllHandler } from './handlers/removalAllHandler';
import { UpdateTodoHandler } from './handlers/updateTodoHandler';
import { RemoveOneHandler } from './handlers/removalOneHandler';
const port = process.env.PORT || 3005;
let data: TodoItem[] = [];

const urlMethodHandlers: UrlMethodHandler[] = [
    // 重置資料(僅測試用)
    new ResetDataHandler(() => data.length = 0),
    // 取得所有待辦事項
    new GetTodosHandler(() => data),
    // 新增待辦事項
    new PostTodosHandler(() => data),
    // 更新單筆資料
    new UpdateTodoHandler(()=> data),
    // 移除全部資料
    new RemoveAllHandler(() => data.length = 0),
    // 移除單筆資料
    new RemoveOneHandler(() => data),
    // 無對應資料(放在最後面)
    new NotFoundTodoHandler(),
];
http.createServer(async (request, response) => {
    console.log(`${request.method} ${request.url}`);
    for (const urlMethodHandler of urlMethodHandlers) {
        const handled = urlMethodHandler.check(request);
        if (handled) {
            urlMethodHandler.handle(request, response);
            break;
        }
    }
}).listen(port, () => {
    console.log(`Server running at port ${port}`);
});
