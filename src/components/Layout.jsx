import React from 'react';
require('es6-promise').polyfill();
import fetch from 'isomorphic-fetch';

class Layout extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: null
    };
  }

  _fetchContent(jurisdiction, topic) {
    fetch(`/api/${jurisdiction}/${topic}`)
    .then((response) => {
        if (response.status >= 400) {
            throw new Error("Bad response from server");
        }
        console.log("Layout response");
        console.log(response);
        return response.json();
    })
    .then((content) => {
        console.log("Layout content");
        console.log(content);
        this.setState({ data: content });
    });
  }

  componentDidMount() {
    this._fetchContent(this.props.params.jurisdiction, this.props.params.topic);
  }

  componentWillReceiveProps(nextProps) {
    console.log("Layout nextProps");
    console.log(nextProps);
    if (this.props !== nextProps) {
      if (nextProps.jurisdiction == this.props.params.jurisdiction) {
        this.props.params.topic = nextProps.params.topic;
      }
      else {
        this.props.params.jurisdiction = nextProps.params.jurisdiction;
        this.props.params.topic = nextProps.params.topic;
      }
      this._fetchContent(this.props.params.jurisdiction, this.props.params.topic);
    }
  }

  render() {
    if (this.state.data) {
      {console.log("Layout this.state.data inside render if")}
      {console.log(this.state.data)}
      let children = React.Children.map(this.props.children, (child) => {
        return React.cloneElement(child, {
          data: this.state.data
        })
      })

      return(
        <div>
          <div className="app-content">{children}</div>
        </div>
      );
    }
    return (<div>Loading...</div>);
  }
};

module.exports = Layout;
