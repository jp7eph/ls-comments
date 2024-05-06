export class Comment {
    // コメントはdata-ref属性にUUIDが発行され識別できるためその値を利用する
    // ジャンプ時もこのIDを使って要素を取得する
    refId: string;
    // コメントが付いた本文（Not コメント本文）
    bodyText: string;
    // 解決済みフラグ
    isResolved: boolean;

    constructor(refId: string) {
        this.refId = refId;
        this.bodyText = '';
        this.isResolved = false;
    }
}
