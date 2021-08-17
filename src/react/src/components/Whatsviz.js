import axios from "axios";
import React from "react";
import { operation } from "retry";
import { withRouter } from "react-router-dom";
import {
  Container,
  Divider,
  Header,
  Card,
  SegmentGroup,
  Segment,
  Icon,
  Button,
  Message,
} from "semantic-ui-react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import wordcloud from "wordcloud";

import Summary from "./charts/Summary";
import Timeline from "./charts/Timeline";
import jsPDF from "jspdf";
const server = process.env.REACT_APP_WHATSVIZ_SERVER || "";

class Whatsviz extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.match.params.id,
      file: null,
      server: axios.create({ baseURL: server }),
      data: null,
      ping: false,
      fileUploading: false,
    };
  }

  componentDidMount() {
    this.fileUploadRef = React.createRef();
    this.summaryRef = React.createRef();
    this.timelineRef = React.createRef();
    this.wordcloudRef = React.createRef();

    this.ping();

    if (this.state.id) {
      this.loadData(this.state.id);
    }
  }

  async ping() {
    try {
      await this.state.server.get("/");
      this.setState({ ping: true });
    } catch (error) {
      this.setState({ ping: false });
    }
  }

  async loadData(id) {
    let tryLoad = operation({ factor: 1 });

    tryLoad.attempt(async () => {
      try {
        let data = await this.state.server.get(`/chat/${id}`);
        this.setState({ data: data.data });
        wordcloud(this.wordcloudRef.current, {
          list: data.data.frequency.map((d) => [d.text, d.count]),
        });
      } catch (e) {
        this.setState({ data: null });
        tryLoad.retry(e);
      }
    });
  }

  async onFileUpload(e) {
    let file = e.target.files[0];

    const formData = new FormData();
    formData.append("file", file, file.name);
    this.setState({ fileUploading: true });
    try {
      let upload = await this.state.server.post("/chat", formData);
      this.props.history.push(`/${upload.data}`);
      this.loadData(upload.data);
      this.setState({ id: upload.data, file, fileUploading: false });
    } catch (e) {
      this.setState({ file: null, fileUploading: false });
    }
  }

  async onClickDownload(e) {
    const padding = 100;

    let doc = new jsPDF("l", "mm");
    doc.deletePage(1);

    let summary = this.summaryRef.current.ref.current;
    this.addCanvasImageToPDF(
      summary.canvas,
      summary.toBase64Image(),
      padding,
      doc
    );

    let timeline = this.timelineRef.current.ref.current;
    this.addCanvasImageToPDF(
      timeline.canvas,
      timeline.toBase64Image(),
      padding,
      doc
    );

    let wordcloudCanvas = this.wordcloudRef.current;
    this.addCanvasImageToPDF(
      wordcloudCanvas,
      wordcloudCanvas.toDataURL("image/jpeg"),
      padding,
      doc
    );

    doc.save("whatsviz.pdf");
  }

  addCanvasImageToPDF(canvas, imageBase64, padding, doc) {
    doc.addPage([canvas.width + padding, canvas.height + padding]);
    doc.addImage(
      imageBase64,
      "JPEG",
      padding / 2,
      padding / 2,
      canvas.width,
      canvas.height
    );
  }

  onClickHeader(e) {
    this.setState({ data: null, file: null, id: null });
  }

  render() {
    return (
      <Container style={{ height: "100vh", marginTop: "5vh" }}>
        <Header size="huge">
          <Header.Content>
            <a
              href="#"
              onClick={this.onClickHeader.bind(this)}
              style={{ textDecoration: "none", color: "green" }}
            >
              Whatsviz
            </a>
            <Header.Subheader style={{ color: "grey" }}>
              server status{" "}
              <Icon
                name={this.state.ping ? "check" : "close"}
                color={this.state.ping ? "green" : "red"}
              />
            </Header.Subheader>
          </Header.Content>
        </Header>
        <Divider hidden />
        {this.state.file || this.state.id ? (
          <div />
        ) : (
          <div>
            <Button
              label={this.state.fileUploading ? "Loading" : "Upload Chat File"}
              disabled={this.state.fileUploading}
              loading={this.state.fileUploading}
              icon="file"
              onClick={() => this.fileUploadRef.current.click()}
            />
            <input
              ref={this.fileUploadRef}
              style={{ display: "none" }}
              type="file"
              onChange={this.onFileUpload.bind(this)}
            />
          </div>
        )}
        <Divider hidden section />
        {this.state.data ? (
          <SegmentGroup style={{ minWidth: "750px" }}>
            <Button
              label="Download"
              icon="download"
              onClick={this.onClickDownload.bind(this)}
            />
            <Divider />
            <Segment>
              <Summary
                ref={this.summaryRef}
                id="summary"
                data={this.state.data.summary}
              />
            </Segment>
            <Segment>
              <Timeline
                ref={this.timelineRef}
                data={this.state.data.timeline}
              />
            </Segment>
            <Segment>
              <canvas ref={this.wordcloudRef} style={{ width: "100%" }} />
            </Segment>
            <Divider />
          </SegmentGroup>
        ) : this.state.id ? (
          <Card fluid>
            <Card.Content>
              <Card.Header>
                Entry is loading. You can refresh or re-visit this link later as
                well.
              </Card.Header>
            </Card.Content>
            <Card.Content extra>
              <CopyToClipboard text={window.location.href}>
                <Button label="Copy" icon="copy" />
              </CopyToClipboard>
            </Card.Content>
          </Card>
        ) : (
          <div />
        )}
        <Message error>
          <Message.Header>Note</Message.Header>
          <Message.Content>
            This website is for demo purposes only. Raw chat data is procssed
            for visulization and immediately deleted. Background jobs also run
            near-daily to cleanup up raw chat data and the visulization data.
            Source code can be found{" "}
            <a href="https://github.com/sidxdev/whatsviz">here</a>.
          </Message.Content>
        </Message>
      </Container>
    );
  }
}

export default withRouter(Whatsviz);
