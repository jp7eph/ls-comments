import './App.css';
import { useState } from 'react';
import { Message } from './background';
import { Comment } from './comment';
import { AppBar, Box, Collapse, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography } from '@mui/material';
import CommentIcon from '@mui/icons-material/Comment';
import DoneIcon from '@mui/icons-material/Done';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

function App() {
  // console.trace('[ls-comments] open action!!');

  const [unResolvedComments, setUnResolvedComments] = useState<Comment[]>([]);
  const [resolvedComments, setResolvedComments] = useState<Comment[]>([]);
  const message: Message = { type: 'getComments', comments: [] };
  chrome.runtime.sendMessage(message, (response: Comment[]) => {
    // console.debug('[ls-comments]', 'get comments', { response });
    if (response != null) {
      setUnResolvedComments(response.filter((comment) => { return !comment.isResolved; }));
      setResolvedComments(response.filter((comment) => { return comment.isResolved; }));
    }
  });

  const [openUnResolveds, setOpenUnResolveds] = useState(true);
  const [openResolveds, setOpenResolveds] = useState(false);
  const handleOpenUnResolveds = () => { setOpenUnResolveds(!openUnResolveds); };
  const handleOpenResolveds = () => { setOpenResolveds(!openResolveds); };

  return (
    <>
      <AppBar position='static'>
        <Toolbar>
          <Typography variant='h6'>ls-comments</Typography>
        </Toolbar>
      </AppBar>
      {unResolvedComments == null && resolvedComments == null ? (
        <Typography variant='body1' sx={{ p: 2 }}>インラインコメントがありません</Typography>
      ) : (
        <Box sx={{ height: 300, width: '100%', overflow: 'auto' }}>
          <List>
            <ListItemButton onClick={handleOpenUnResolveds}>
              <ListItemIcon>
                <CommentIcon color='warning' />
              </ListItemIcon>
              <ListItemText primary={'未解決 (' + unResolvedComments.length + ')'} />
              {openUnResolveds ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openUnResolveds} timeout="auto" unmountOnExit>
              <CommentList comments={unResolvedComments} />
            </Collapse>
            <ListItemButton onClick={handleOpenResolveds}>
              <ListItemIcon>
                <DoneIcon color='success' />
              </ListItemIcon>
              <ListItemText primary={'解決済 (' + resolvedComments.length + ')'} />
              {openResolveds ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openResolveds} timeout="auto" unmountOnExit>
              <CommentList comments={resolvedComments} />
            </Collapse>
          </List >
        </Box>
      )
      }
    </>
  );
}

export default App;

function CommentList(props: { comments: Comment[] }) {
  return (
    <>
      <List disablePadding>
        {
          props.comments.map((comment) => (
            <ListItem key={comment.refId} disablePadding>
              <ListItemButton sx={{ pl: 4 }} onClick={() => {
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
      </List>
    </>
  );
}
