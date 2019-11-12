import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { Redirect, Link, Route } from "react-router-dom";
import DocumentEditor from "./DocumentEditor";

export default function UserPortal() {
  const [docname, setDocname] = useState("");
  const [newDocPass, setNewDocPass] = useState("");

  const [findDocId, setDocId] = useState("");
  const [findDocPass, setFindDocPass] = useState("");

  const [allDocuments, setAllDocuments] = useState([]);

  const getDocuments = async () => {
    try {
      let response = await axios.get("http://cooldox-backend.herokuapp.com/portals", {
        withCredentials: true
      });
      let content = response.data;
      if (!content.success) {
        console.log("failed to get documents");
      } else {
        setAllDocuments(content.documents);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleNewDocument = async e => {
    e.preventDefault();
    try {
      let response = await axios.post(
        "http://cooldox-backend.herokuapp.com/newDocument",
        {
          title: docname,
          password: newDocPass
        },
        {
          withCredentials: true
        }
      );
      setNewDocPass("");
      setDocname("");

      let docData = response.data;
      let document = docData.document;
      let id = document._id;
      setDocname("");
      setNewDocPass("");
      getDocuments();
    } catch (e) {
      console.log(e);
    }
  };

  const handleAddDocument = async e => {
    e.preventDefault();
    try {
      let response = await axios.post(
        "http://cooldox-backend.herokuapp.com/addDocumentById",
        {
          id: findDocId,
          password: findDocPass
        },
        {
          withCredentials: true
        }
      );
      setDocId("");
      setFindDocPass("");
      getDocuments();
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getDocuments();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="portal-content">
        <div className="new-doc-container">
          <h2>Add a New Document</h2>
          <input
            className="un"
            type="text"
            placeholder="document name"
            value={docname}
            onChange={e => setDocname(e.target.value)}
          />
          <input
            className="un"
            type="password"
            name=""
            placeholder="password"
            value={newDocPass}
            onChange={e => setNewDocPass(e.target.value)}
          />
          <p>
            <button type="submit" onClick={e => handleNewDocument(e)}>
              Add!
            </button>
          </p>
        </div>
        <div className="add-doc-container">
          <h2>Find a document to Add</h2>
          <input
            className="un"
            type="text"
            placeholder="document id"
            value={findDocId}
            onChange={e => setDocId(e.target.value)}
          />
          <input
            className="un"
            type="password"
            name=""
            id=""
            placeholder="password"
            value={findDocPass}
            onChange={e => setFindDocPass(e.target.value)}
          />
          <p>
            <button type="submit" onClick={e => handleAddDocument(e)}>
              Find!
            </button>
          </p>
        </div>
      </div>
      <div className="docList">
        <h3>Your documents</h3>
        {!allDocuments.length ? (
          <div>No Documents! yet!!</div>
        ) : (
          allDocuments.map(doc => {
            return (
              <h5>
                <Link
                  to={{ pathname: `/editor/${doc._id}`, state: { docId: doc._id } }}
                  style={{ color: "#8c55aa" }}
                  exact
                >
                  {doc.title}
                </Link>
              </h5>
            );
          })
        )}
      </div>
    </div>
  );
}
