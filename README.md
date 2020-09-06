# Information Security Project #2 - Anonymous Message Board.

## View project

[Anonymous Message Board](https://anonymous-message-board-kel.glitch.me/)

## User Stories

1. Only allow your site to be loading in an iFrame on your own pages.

2. Do not allow DNS prefetching.

3. Only allow your site to send the referrer for your own pages.

4. I can POST a thread to a specific message board by passing form data containing text and delete_password to <code>/api/threads/{board}</code>. The object saved (and returned) will include \_id, text, created_on, bumped_on(starts same as created_on), reported(boolean), delete_password and replies(array).

5. I can POST a reply to a thread on a specific message board by passing form data containing text, delete_password and thread_id to <code>/api/replies/{board}</code> and it will also update the bumped_on date to the reply date. The object saved (and returned) will include \_id, text, created_on, reported(boolean), and delete_password.

6. I can GET an array of the most recent 10 bumped threads on the board with only the most recent 3 replies each from <code>/api/threads/{board}</code>. The reported and delete_password fields will not be sent to the client.

7. I can GET an entire thread with all its replies from <code>/api/replies/{board}?thread_id={thread_id}</code>. The reported and delete_password fields will not be sent to the client.

8. I can delete a thread completely if I send a DELETE request to <code>/api/threads/{board}</code> and pass along the thread_id and delete_password. (Text response will be 'incorrect password' or 'success')

9. I can delete a post(just changing the text to '[deleted]' instead of removing completely like a thread) if I send a DELETE request to <code>/api/replies/{board}</code> and pass along the thread_id, reply_id and delete_password. (Text response will be 'incorrect password' or 'success')

10. I can report a thread and change its reported value to true by sending a PUT request to <code>/api/threads/{board}</code> and pass along the thread_id. (Text response will be 'success')

11. I can report a reply and change its reported value to true by sending a PUT request to <code>/api/replies/{board}</code> and pass along the threadid* & replyid*. (Text response will be 'success')

12. Complete functional tests that wholely test routes and pass.

## Additional Dependencies

- [Connect-flash](https://www.npmjs.com/package/connect-flash).
- [Cookie-session](https://www.npmjs.com/package/cookie-session).
- [Dotenv](https://www.npmjs.com/package/dotenv).
- [Express](https://www.npmjs.com/package/express).
- [Helmet](https://www.npmjs.com/package/helmet).
- [Method Override](https://www.npmjs.com/package/methodoverride).
- [Moment](https://www.npmjs.com/package/moment).
- [MongoDB](https://www.npmjs.com/package/mongodb).
- [Mongoose](https://www.npmjs.com/package/mongoose).
- [Node-fetch](https://www.npmjs.com/package/node-fetch).
- [Pug](https://www.npmjs.com/package/pug).
- [Jest](https://www.npmjs.com/package/jest).
- [SuperTest](https://www.npmjs.com/package/supertest).
