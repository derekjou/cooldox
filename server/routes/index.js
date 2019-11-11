const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Document = require("../models/Document");

// all routes after login
router.get("/portals", (req, res) => {
  const user = req.user;

  Document.find().exec((err, docs) => {
    docs = docs.filter(doc => {
      return doc.collaborators.includes(user._id);
    });
    if (err) {
      res.json({
        success: false,
        error: err
      });
    } else {
      res.json({
        success: true,
        documents: docs
      });
    }
  });
});

router.post("/newDocument", (req, res) => {
  let newDoc = new Document({
    title: req.body.title,
    content: "",
    collaborators: [req.user._id],
    password: req.body.password
  });
  newDoc
    .save()
    .then(document => res.json({ success: true, document: document }))
    .catch(e => res.json({ success: false, error: e }));
});

router.post("/addDocument", async (req, res) => {
  try {
    console.log("in wrong one");
    let doc = await Document.findOne({ title: req.body.title });
    const collabs = doc.collaborators;
    await Document.updateOne(
      { title: req.body.title },
      { collaborators: [...collabs, req.user.id] }
    );
    doc.collaborators = [...collabs, req.user.id];
    await doc.save();
    res.send(doc);
  } catch (e) {
    console.log(e);
    res.send(e);
  }
});

router.post("/addDocumentById", async (req, res) => {
  try {
    let doc = await Document.findById(req.body.id);
    if (doc.password === req.body.password) {
      const collabs = doc.collaborators;
      await Document.updateOne(
        { id: req.body.id },
        { collaborators: [...collabs, req.user.id] }
      );
      doc.collaborators = [...collabs, req.user.id];
      await doc.save();
      res.send(doc);
    } else {
      res.json({ success: false, error: "No document found with the id and password" });
    }
  } catch (e) {
    console.log(e);
    res.send(e);
  }
});

router.post("/getEditor", async (req, res) => {
  try {
    let doc = await Document.findById(req.body.id);
    res.json({ success: true, document: doc });
  } catch (e) {
    res.json({ success: false, error: e });
    console.log(e, "THIS THE ERROR");
  }
});

router.post("/editor/:id/save", async (req, res) => {
  try {

    let doc = await Document.findById(req.params.id)
    doc.history.push({content: req.body.content, modifiedAt: req.body.modifiedAt})

    await doc.save();
    res.json({
      success: true
    });
  } catch (e) {
    res.json({ success: false, error: e });
    console.log(e);
  }
});


router.get("/editor/:id/save", async (req, res) => {
  try {
    let doc = await Document.findById(req.params.id)
    const latestDoc = doc.history[doc.history.length - 1]
    res.json({
      success: true,
      latestDoc,
    })
  } catch (e) {
    res.json({ success: false, error: e });
    console.log(e);
  }
});


module.exports = router;
