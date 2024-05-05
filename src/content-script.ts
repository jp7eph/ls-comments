import { Message } from './background';
import { Comment } from './comment';

// コメントの取得のために読み込みを遅延させる
window.addEventListener('load', main, false);

function main() {
    console.log('[ls-comments] start ls-comments');
    const loadCheckInterval = setInterval(() => {
        // コメントの解決済み状態は非同期で読み込まれるため
        // bodyにsynchrony-active classが付与されるまで1sec単位でスリープする
        const bodyClass = document.body.classList;
        if (bodyClass.contains('synchrony-active')) {
            clearInterval(loadCheckInterval);
            console.debug('[ls-comments] load complete!!!');
            const comments = checkComments();
            sendComments(comments);
        }
    }, 1000);
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
