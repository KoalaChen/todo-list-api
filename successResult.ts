import { TodoItem } from "./todoItem";

export interface SuccessResult {
    status: "success",
    data: readonly TodoItem[]
};