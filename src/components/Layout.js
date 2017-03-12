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

  componentDidMount() {
    console.log("this.props");
    console.log(this.props);
    fetch(`/api/${this.props.params.jurisdiction}/${this.props.params.topic}`)
    //fetch(`/api/buncombe/health`)
    .then((response) => {
        if (response.status >= 400) {
            throw new Error("Bad response from server");
        }
        // const api = response.json();
        //console.log("response");
        //console.log(response);
        // this.setState({ data: api });
        return response.json();
    })
    .then((content) => {
        //const api = content;
        console.log("content");
        console.log(content);
        this.setState({ data: content });
    });
  }

  render() {
    {console.log("this.state.data")}
    {console.log(this.state.data)}
    if (this.state.data) {
      {console.log("this.state.data inside render if")}
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
    return <div>Loading...</div>;
  }
};

module.exports = Layout;
