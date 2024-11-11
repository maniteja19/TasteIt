const express = require('express');
const { commentsController, getCommentsController, displayFeedback } = require('../controllers/commentController');
const router = express();

router.post('/comment',commentsController);
router.get('/comment/:userId',getCommentsController);
router.get('/feedback/:userId',displayFeedback);
module.exports = router;