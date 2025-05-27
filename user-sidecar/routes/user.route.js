const express = require('express');
const router = express.Router();
const { processIdentityCheck } = require('../sidecar/sidecar.service');

router.post('/process/:id', async (req, res) => {
  try {
    const user = await processIdentityCheck(req.params.id);
    res.json({ message: 'User processed', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;