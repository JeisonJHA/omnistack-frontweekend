/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {
  // , { useEffect, useState }
  Component
} from "react";
import api from "../../services/api";
import { distanceInWords } from "date-fns";
import pt from "date-fns/locale/pt";
import DropZone from "react-dropzone";
import socket from "socket.io-client";

import { MdInsertDriveFile } from "react-icons/md";

import logo from "../../assets/logo.svg";
import "./styles.css";

class Box extends Component {
  // const [stateBox, setStateBox] = useState({});
  state = {
    box: {}
  };

  // useEffect(() => {
  //   fetchData();
  //   subscribeToNewFiles();
  // }, []);
  async componentDidMount() {
    // async function fetchData() {
    this.subscribeToNewFiles();
    const box = this.props.match.params.id;
    const resp = await api.get(`boxes/${box}`);
    this.setState({ box: resp.data });
    // setStateBox(resp.data);
  }

  subscribeToNewFiles = () => {
    const box = this.props.match.params.id;
    const io = socket("https://omnistack-backweekend.herokuapp.com");
    io.emit("connectRoom", box);
    io.on("file", data => {
      console.log(data);
      // setStateBox({ files: [data, ...stateBox.files] });
    });
  };

  handleUpload = files => {
    files.forEach(file => {
      const data = new FormData();
      const box = this.props.match.params.id;
      data.append("file", file);

      api.post(`boxes/${box}/files`, data);
    });
  };
  render() {
    return (
      <div id="box-container">
        <header>
          <img src={logo} alt="" />
          <h1>{this.state.box.title}</h1>
        </header>
        <DropZone onDropAccepted={this.handleUpload}>
          {({ getRootProps, getInputProps }) => (
            <div className="upload" {...getRootProps()}>
              <input {...getInputProps()} />
              <p>Arraste aqui</p>
            </div>
          )}
        </DropZone>
        <ul>
          {this.state.box.files &&
            this.state.box.files.map(file => (
              <li key={file.id}>
                <a className="fileInfo" href={file.url} target="_blanck">
                  <MdInsertDriveFile size={24} color="#A5Cfff" />
                  <strong>{file.title}</strong>
                </a>
                <span>
                  há{" "}
                  {distanceInWords(file.createdAt, new Date(), { locale: pt })}
                </span>
              </li>
            ))}
        </ul>
      </div>
    );
  }
}

export default Box;
