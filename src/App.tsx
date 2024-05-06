import './App.css';
import { useState } from 'react';
import { Message } from './background';
import { Comment } from './comment';
import { AppBar, Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography } from '@mui/material';
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
      <AppBar position='static'>
        <Toolbar>
          <Typography variant='h6'>ls-comments</Typography>
        </Toolbar>
      </AppBar>
      {comments == null || comments.length == 0 ? (
        <Typography variant='body1' sx={{ p: 2 }}>インラインコメントがありません</Typography>
      ) : (
        <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
          <List>
            {
              comments.map((comment) => (
                <ListItem key={comment.refId} disablePadding>
                  <ListItemButton onClick={() => {
                    // 表示しているタブのcontent-scriptに対してコメントジャンプの指示を飛ばす
                    chrome.tabs.query({ active: true, lastFocusedWindow: true }, async (tabs) => {
                      if (tabs.length > 0 && tabs[0].id != undefined) {
                        const message: Message = { type: 'jumpComments', comments: [comment] };
                        chrome.tabs.sendMessage(tabs[0].id, message);
                      }
                    });
                  }}>
                    <ListItemIcon>
                      {comment.isResolved ? (<DoneIcon color='success' />) : (<CommentIcon color='warning' />)}
                    </ListItemIcon>
                    <ListItemText primary={comment.bodyText} />
                  </ListItemButton>
                </ListItem>
              ))
            }
          </List >
        </Box>
      )
      }
    </>
  );
}

export default App;
