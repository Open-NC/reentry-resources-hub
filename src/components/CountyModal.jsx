import React from 'react';
import { Modal, Button } from 'react-bootstrap';
//import { Link } from 'react-router';
import { nc } from '../counties'

class CountyModal extends React.Component {
  render() {
    return (
      <Modal {...this.props} bsSize='sm' aria-labelledby='contained-modal-title-lg'>
        <Modal.Header closeButton>
          <Modal.Title id='contained-modal-title-lg'>North Carolina Reentry Resources Hub</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='county-modal-list'>
            <h4>Select County for information on services.</h4>
            {nc.map((county) => {
              return (
                <div>
                  <Button bsStyle='link' href={`/${county}/home`}>{county}</Button>
                </div>
              );
            })}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

module.exports = CountyModal;
