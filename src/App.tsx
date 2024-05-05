import './App.css';
import { useState } from 'react';
import { Message } from './background';
import { Comment } from './comment';

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
      <ul>
        {
          comments.map((comment) => (
            <li>{comment.bodyText}</li>
          ))
        }
      </ul>
    </>
  );
}

export default App;
