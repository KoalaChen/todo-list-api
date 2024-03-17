import * as http from 'http';

export interface UrlMethodHandler {
    /** 確認是否要執行此方法 */
    check(req: http.IncomingMessage): boolean;
    /** 執行方法 */
    handle(req: http.IncomingMessage, res: http.ServerResponse): void;
}