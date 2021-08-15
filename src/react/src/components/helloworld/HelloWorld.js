import React from "react";
import { withRouter } from "react-router-dom";
import { Container, Divider, Header } from 'semantic-ui-react';


class HelloWorld extends React.Component {
  render() {
    return <Container style={{ height: '100vh', marginTop: '5vh' }}>
      <Header size="huge" content="Hello World" color="green" />
      <Divider hidden />
    </Container>;
  }
}


export default withRouter(HelloWorld);