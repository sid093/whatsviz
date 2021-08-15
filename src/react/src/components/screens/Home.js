import React, { createRef } from "react";
import { Link } from "react-router-dom";
import { Card, Container, Divider, Header, Input, Message } from 'semantic-ui-react'
import { appsList } from '../../config'

const navigation = (to) => {
  const TextLink = React.forwardRef((props, ref) => (
    <a ref={ref} href={props.href}>Go to app!</a>
  ));

  return <Link to={to} component={TextLink} />;
}

const apps = appsList.map(({ path, ...e }) => ({
  extra: navigation(path),
  raised: true,
  style: {
    minWidth: `${14400 / window.innerWidth}%`
  },
  ...e
}))

class Home extends React.Component {
  refSearch = createRef()

  constructor(props) {
    super(props);
    this.state = {
      apps_filtered: apps
    };
  }

  componentDidMount() {
    this.refSearch.current.focus();
  }

  onSearch(e) {
    let query = e.target.value;
    let apps_filtered = apps.filter((e) =>
      e.header.toLowerCase().search(query.toLowerCase()) >= 0
      || e.description.toLowerCase().search(query.toLowerCase()) >= 0)
    this.setState({ apps_filtered })
  }

  render() {
    return <Container style={{ height: '100vh', marginTop: '10vh' }}>
      <Header style={{ color: "#ffffff" }}>sidx.dev Portfolio Website</Header>
      <Divider hidden />
      <Input fluid icon='search' placeholder='Search...' ref={this.refSearch} onChange={this.onSearch.bind(this)} />
      <Divider hidden section />
      <Card.Group centered itemsPerRow={4} items={this.state.apps_filtered} />
      <Divider hidden section />
      <Message warning>
        <Message.Header>Note</Message.Header>
        <Message.Content>
          This website is for demo purposes only. Source code can be found <a href="https://github.com/sidxdev/sidxdev.github.io">here</a>.
        </Message.Content>
      </Message>
    </Container>;
  }
}


export default Home;