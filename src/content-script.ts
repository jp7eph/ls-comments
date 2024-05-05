import { Message } from './background';
import { Comment } from './comment';

// コメントの取得のために読み込みを遅延させる
window.addEventListener('load', main, false);

function main() {
    console.log('[ls-comments] start ls-comments');
    const loadCheckInterval = setInterval(() => {
        // コメントの解決済み状態は非同期で読み込まれるため
        // bodyにsynchrony-active classが付与されるまで1secごとにチェックする
        const bodyClass = document.body.classList;
        if (bodyClass.contains('synchrony-active')) {
            clearInterval(loadCheckInterval);
            console.debug('[ls-comments] load complete');
            const comments = checkComments();
            sendComments(comments);
        }
    }, 1000);

    // ロード完了チェック関数が無限に動き続けないよう10秒経過したら停止する
    setTimeout(() => {
        console.debug('[ls-comments] stop loadCheckInterval');
        clearInterval(loadCheckInterval);
    }, 10000);
}

// 表示しているページのコメント一覧をスクレイピング
function checkComments() {
    const comments: Comment[] = [];
    const e = document.getElementsByClassName('inline-comment-marker');
    const eleArray = Array.from(e);
    eleArray.forEach((ele) => {
        if (ele.attributes.getNamedItem('data-ref') != null) {
            const c = new Comment(ele.attributes.getNamedItem('data-ref')?.nodeValue as string);
            if (ele.textContent != null) c.bodyText = ele.textContent;
            if (!ele.classList.contains('valid')) c.isResolved = true;
            comments.push(c);
            console.trace('[ls-comments]', { c });
        }
    });
    return comments;
}

// 全てのコメントをbackgroundへ送信する
function sendComments(comments: Comment[]) {
    const message: Message = { type: 'setComments', comments: comments };
    chrome.runtime.sendMessage(message);
}

chrome.runtime.onMessage.addListener((message: Message) => {
    switch (message.type) {
        // browser actionで選択されたコメントにジャンプする処理
        case 'jumpComments': {
            console.debug('[ls-comments] recived jumpComments', { message });
            // data-ref属性が付与されたElementを全取得してから指定されたコメントを検索する
            const elements = Array.from(document.querySelectorAll('[data-ref]'));
            const element = elements.find(e => {
                if (e.attributes.getNamedItem('data-ref') != null && message.comments.length > 0) {
                    return e.attributes.getNamedItem('data-ref')?.nodeValue == message.comments[0].refId;
                }
            });
            if (element != undefined) element.scrollIntoView({ block: 'center' });
            break;
        }
        default: {
            console.error('[ls-comments]', 'undefined type');
            break;
        }
    }
});
