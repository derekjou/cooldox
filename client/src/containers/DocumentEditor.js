import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch, Link, Redirect } from "react-router-dom";
import Draft from "../components/Draft";
import Navbar from "../components/Navbar";
import axios from "axios";
import io from "socket.io-client";

export default function DocumentEditor({ match }) {
  const [document, setDocument] = useState(null);
  const [socket, setSocket] = useState(null);


  useEffect(() => {
    setSocket(io("https://cooldox-backend.herokuapp.com/"));
    getDocument();
  }, []);

  const getDocument = async () => {
    const resp = await axios.post(
      `https://cooldox-backend.herokuapp.com/getEditor`,
      {
        id: match.params.id
      },
      {
        withCredentials: true
      }
    );
    if (resp.data.success) {
      setDocument(resp.data.document);
    }
  };

  return (
    <div>
      <Navbar />
      {document ? (
        <div className="doc-editor-container">
          <h3>{document.title}</h3>
          <p>Shareable id: {match.params.id} <button
            style={{marginLeft: 20}}
            className="submit"
          >
            <Link 
            style={{textDecoration: 'none', color: 'inherit'}}
            to='/portal'>Back to Portal</Link>
          </button></p>
          <Draft document={document} docId={match.params.id} socket={socket} />
        </div>
      ) : (
        <div className="doc-editor-container">Document not found sorry dude</div>
      )}
    </div>
  );
}
