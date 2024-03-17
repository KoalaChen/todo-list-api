import * as http from 'http';

export function createResquestBodyPromise(request: http.IncomingMessage): Promise<string> {
    return new Promise((resolve, reject) => {
        let body = '';
        request.on('data', (chunk) => {
            body += chunk;
        });
        request.on('end', () => {
            resolve(body);
        });
        request.on('error', (error) => {
            reject(error);
        });
    });
}
