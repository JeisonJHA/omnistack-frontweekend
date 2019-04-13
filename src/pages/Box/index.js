import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { distanceInWords } from "date-fns";
import pt from "date-fns/locale/pt";
import DropZone from "react-dropzone";
import socket from "socket.io-client";

import { MdInsertDriveFile } from "react-icons/md";

import logo from "../../assets/logo.svg";
import "./styles.css";

const Box = props => {
  const [boxState, setBoxState] = useState(null);
  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    subscribeToNewFiles();
  }, [boxState]);

  async function fetchData() {
    const box = props.match.params.id;
    const resp = await api.get(`boxes/${box}`);
    setBoxState(resp.data);
  }

  const subscribeToNewFiles = () => {
    if (boxState === null) return;
    const box = props.match.params.id;
    const io = socket("https://omnistack-backweekend.herokuapp.com");
    io.emit("connectRoom", box);
    io.on("file", data => {
      setBoxState({ files: [data, ...boxState.files] });
    });
  };

  const handleUpload = files => {
    files.forEach(file => {
      const data = new FormData();
      const box = props.match.params.id;
      data.append("file", file);

      api.post(`boxes/${box}/files`, data);
    });
  };
  return (
    <div id="box-container">
      <header>
        <img src={logo} alt="" />
        <h1>{boxState && boxState.title}</h1>
      </header>
      <DropZone onDropAccepted={handleUpload}>
        {({ getRootProps, getInputProps }) => (
          <div className="upload" {...getRootProps()}>
            <input {...getInputProps()} />
            <p>Arraste aqui</p>
          </div>
        )}
      </DropZone>
      <ul>
        {boxState &&
          boxState.files &&
          boxState.files.map(file => (
            <li key={file.id}>
              <a className="fileInfo" href={file.url} target="_blanck">
                <MdInsertDriveFile size={24} color="#A5Cfff" />
                <strong>{file.title}</strong>
              </a>
              <span>
                há {distanceInWords(file.createdAt, new Date(), { locale: pt })}
              </span>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Box;
