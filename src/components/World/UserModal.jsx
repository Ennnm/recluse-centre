import React from 'react';
import { Card } from 'react-bootstrap';
import '../../styles.scss';
import 'tailwindcss/tailwind.css';
// src / components / World / UserModal.jsx;
const ToolsModal = () => {
  const placement = 'top';

  return (
    <Card className="z-10">
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
