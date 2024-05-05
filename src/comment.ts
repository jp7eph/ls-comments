export class Comment {
    // コメントの付いたElement（ジャンプ用）
    element: Element;
    // コメントが付いた本文（Not コメント本文）
    bodyText: string;
    // 解決済みフラグ
    isResolved: boolean;

    constructor(e: Element) {
        this.element = e;
        this.bodyText = '';
        this.isResolved = false;
    }
}
