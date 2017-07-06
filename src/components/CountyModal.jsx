import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Link } from 'react-router';
import { nc } from '../counties'

class CountyModal extends React.Component {
  // constructor() {
  //   super();
  //   this.state = { isModalOpen: false };
  //   // this.modalOpen = this._modalOpen.bind(this);
  //   // this.modalClose = this._modalClose.bind(this);
  // }

  // _modalOpen() {
  //   this.setState({ isModalOpen: true });
  // }
  //
  // _modalClose() {
  //   this.setState({ isModalOpen: false });
  // }

  render() {
    return (
      <Modal {...this.props} bsSize="small" aria-labelledby="contained-modal-title-lg">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">Select North Carolina County</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {nc.map((county) => {
            return (
              <div>
                <a href={`/${county}/home`}>{county}</a>
              </div>
            );
          })}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

module.exports = CountyModal;
