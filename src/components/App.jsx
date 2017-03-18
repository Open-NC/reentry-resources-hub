/* eslint no-console: 0 */
import React from 'react';
import Header from './Header.jsx';
import Content from './Content.jsx';
import Footer from './Footer.jsx';

class App extends React.Component {

  render() {
    return (
      <div>
        <Header data={this.props.data} />
        {console.log('App this.props.data')}
        {console.log(this.props.data)}
        <Content data={this.props.data} />
        <Footer />
      </div>
    );
  }
}

App.propTypes = {
  data: React.PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

module.exports = App;
