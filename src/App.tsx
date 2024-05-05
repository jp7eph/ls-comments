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
              <ListItemButton key={comment.refId}>
                <ListItemIcon>
                  {comment.isResolved ? (<DoneIcon />) : (<CommentIcon />)}
                </ListItemIcon>
                <ListItem>
                  <ListItemText primary={comment.bodyText}></ListItemText>
                </ListItem>
              </ListItemButton>
            ))
          }
        </List>
      )}
    </>
  );
}

export default App;
