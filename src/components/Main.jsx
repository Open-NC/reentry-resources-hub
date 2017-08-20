import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Col, Row } from 'react-bootstrap';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import { nc } from '../counties';

export default class Main extends Component {
  renderCounty = county => (<li key={county}><Link to={`/${county}/home/`}>{county}</Link></li>);

  render() {
    const perCol = Math.ceil(nc.length / 4);
    const col1 = nc.slice(0 * perCol, 1 * perCol);
    const col2 = nc.slice(1 * perCol, 2 * perCol);
    const col3 = nc.slice(2 * perCol, 3 * perCol);
    const col4 = nc.slice(3 * perCol, 4 * perCol);

    return (
      <div>
        <Header {...this.props} />
        <Grid>
          <Row className="content-body">
            <Col xs={12} sm={6} md={3} lg={3}>
              <ul>
                {col1.map(this.renderCounty)}
              </ul>
            </Col>
            <Col xs={12} sm={6} md={3} lg={3}>
              <ul>
                {col2.map(this.renderCounty)}
              </ul>
            </Col>
            <Col xs={12} sm={6} md={3} lg={3}>
              <ul>
                {col3.map(this.renderCounty)}
              </ul>
            </Col>
            <Col xs={12} sm={6} md={3} lg={3}>
              <ul>
                {col4.map(this.renderCounty)}
              </ul>
            </Col>
          </Row>
        </Grid>
        <Footer />
      </div>
    );
  }
}
