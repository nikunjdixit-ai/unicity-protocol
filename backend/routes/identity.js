const express = require("express");
const router = express.Router();
const identityService = require("../services/identity");
const algorandService = require("../services/algorand");

let state = { identity: null, credential: null };

router.post("/verify", (req, res) => {
  const { method } = req.body;

  if (!method) {
    return res.status(400).json({ error: "Method is required" });
  }

  const result = identityService.verifyIdentity(method);

  if (!result) {
    return res.status(400).json({ error: "Invalid verification method" });
  }

  state.identity = result;
  state.credential = result.credential;

  algorandService.registerCredential(result.credential);

  res.status(201).json(result);
});

router.get("/status", (req, res) => {
  if (!state.identity) {
    return res.status(200).json({ verified: false, credential: null });
  }

  res.status(200).json(state);
});

module.exports = router;
