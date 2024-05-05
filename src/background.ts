import { Comment } from "./comment";

export interface Message {
    type: string;
    comments: Comment[];
}

// key:tabのID, value: Comment[]
const comments = new Map<number, Comment[]>();

chrome.runtime.onMessage.addListener((message: Message, _sender, sendResponse) => {
    switch (message.type) {
        // content-scriptからコメント一覧を受信したとき
        case 'setComments': {
            chrome.tabs.query({ active: true, lastFocusedWindow: true }, async (tabs) => {
                if (tabs.length > 0 && tabs[0].id != undefined) {
                    console.debug('[ls-comments] recived setComments', 'tabId: ' + tabs[0].id, { message });
                    comments.set(tabs[0].id, message.comments);
                    const numOfUnresolved = message.comments.filter(value => { return !value.isResolved; }).length;
                    await chrome.action.setBadgeText({ tabId: tabs[0].id, text: numOfUnresolved < 100 ? numOfUnresolved.toString() : '99+' });
                }
            });
            break;
        }

        // browser actionからコメント一覧を取得されるとき
        case 'getComments': {
            chrome.tabs.query({ active: true, lastFocusedWindow: true }, async (tabs) => {
                if (tabs.length > 0 && tabs[0].id != undefined) {
                    console.debug('[ls-comments] recived getComments', 'tabId: ' + tabs[0].id);
                    sendResponse(comments.get(tabs[0].id));
                }
            });
            break;
        }

        default: {
            console.error('undefined type');
            sendResponse({ response: 'undefined type' });
            break;
        }
    }

    // getCommentでtabを取得する際に非同期になるため
    // brwoser actionにレスポンスするためにソケットをCloseしないようにする
    return true;
});
