/** 待辦事項定義 */
export interface TodoItem {
    /** 待辦 id */
    readonly id: string;
    /** 待辦訊息 */
    title: string;
    /** 是否完成 */
    completed: boolean;
}