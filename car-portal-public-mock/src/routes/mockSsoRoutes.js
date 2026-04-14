const express = require('express');

const router = express.Router();

function buildResponse(platform, action, req) {
  return {
    code: 200,
    msg: 'ok',
    data: {
      platform,
      action,
      requestId: req.headers['x-request-id'] || '',
      timestamp: Date.now()
    }
  };
}

router.post('/mock/:platform/exchange', (req, res) => {
  const { platform } = req.params;
  const fail = String(req.query.fail || '').toLowerCase() === 'true';
  if (fail) {
    return res.status(500).json({ code: 500, msg: `${platform} exchange mock failed` });
  }
  return res.json(buildResponse(platform, 'exchange', req));
});

router.post('/mock/:platform/logout', (req, res) => {
  const { platform } = req.params;
  const fail = String(req.query.fail || '').toLowerCase() === 'true';
  if (fail) {
    return res.status(500).json({ code: 500, msg: `${platform} logout mock failed` });
  }
  return res.json(buildResponse(platform, 'logout', req));
});

module.exports = router;
