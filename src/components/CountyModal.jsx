import React from 'react';
import { Modal, Button, ListGroup, ListGroupItem } from 'react-bootstrap';
import { nc } from '../counties';


const County = props =>
  <Button bsStyle="link" className="county-button" href={`/${props.name}/home`}>
    <ListGroupItem className="county-item">
      {props.name}
    </ListGroupItem>
  </Button>

class CountyFilter extends React.Component {

  handleChange(event) {
    this.props.updateSearch(event.target.value);
  }
 
  render() {
    return (
      <input type="text" placeholder="County Search" className="input-search" onChange={this.handleChange.bind(this)} value={this.props.searchText} />
    )
  }
}

class CountiesList extends React.Component {

  filter(counties) {
    if (!this.props.filter) {
      return counties
    }
    return counties.filter((county) => county.toLowerCase().indexOf(this.props.filter.toLowerCase()) >= 0)
  }
  render() {
    return (
        <ListGroup className="county-list">
          { this.filter(this.props.counties)
              .map((county, i) => <County key={i} name={county}></County>)}
        </ListGroup>
    );
  }
}

class CountyModal extends React.Component {

  constructor() {
    super();
    const COUNTIES = nc;


    this.state = {
      counties: COUNTIES,
      filter: ''
    };
  }

  updateSearch(inputValue) {
    let filter = this.state.filter;

    this.setState({
      filter: inputValue
    });
  }

  render() {
    return (
      <Modal
        {...this.props} bsSize="sm" aria-labelledby="contained-modal-title-lg" className="county-modal" style={{ overflowScrolling: 'auto',
          WebkitOverflowScrolling: 'auto' }}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">North Carolina Reentry Resources Hub</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '50%' }}>

            <CountyFilter updateSearch={this.updateSearch.bind(this)} searchText={this.state.filter} />
            <CountiesList filter={this.state.filter} counties={this.state.counties}></CountiesList>

        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}


module.exports = CountyModal;
