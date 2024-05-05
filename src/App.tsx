import './App.css';
import { useState } from 'react';
import { Message } from './background';
import { Comment } from './comment';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import CommentIcon from '@mui/icons-material/Comment';
import DoneIcon from '@mui/icons-material/Done';

function App() {
  console.log('[ls-comments] open action!!');

  const [comments, setComments] = useState<Comment[]>([]);

  const message: Message = { type: 'getComments', comments: [] };
  chrome.runtime.sendMessage(message, (response: Comment[]) => {
    console.log('[ls-comments]', 'get comments', { response });
    setComments(response);
  });

  return (
    <>
      {comments == null || comments.length == 0 ? (
        <p>no comments</p>
      ) : (
        <List>
          {
            comments.map((comment) => (
              <ListItemButton key={comment.refId} onClick={() => {
                // 表示しているタブのcontent-scriptに対してコメントジャンプの指示を飛ばす
                chrome.tabs.query({ active: true, lastFocusedWindow: true }, async (tabs) => {
                  if (tabs.length > 0 && tabs[0].id != undefined) {
                    const message: Message = { type: 'jumpComments', comments: [comment] };
                    chrome.tabs.sendMessage(tabs[0].id, message);
                  }
                });
              }}>
                <ListItemIcon>
                  {comment.isResolved ? (<DoneIcon />) : (<CommentIcon />)}
                </ListItemIcon>
                <ListItem>
                  <ListItemText primary={comment.bodyText}></ListItemText>
                </ListItem>
              </ListItemButton>
            ))
          }
        </List >
      )
      }
    </>
  );
}

export default App;
