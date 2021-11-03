import React from 'react';
import { Card } from 'react-bootstrap';

const ToolsModal = () => {
  const placement = 'top';

  return (
    <Card>
      <Card.Body>This is some text within a card body.</Card.Body>
    </Card>
  );
};

export default function UserModal(userSquare) {
  const lalala = 5;
  console.log('userSquare in tools :>> ', userSquare);
  return (
    <div style={{ display: 'none', position: 'absolute' }}>
      <ToolsModal />
    </div>
  );
}
