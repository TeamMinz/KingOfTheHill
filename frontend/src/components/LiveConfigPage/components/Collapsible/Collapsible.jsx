import React, { useState } from 'react';
import {
  CollapsibleHeader,
  ToggleButton,
  CollapsibleBody,
  CollapsibleTitle,
} from './Collapsible.style';

const Collapsible = ({ children, title, isOpen }) => {
  const [IsOpen, setOpen] = useState(isOpen);

  return (
    <div>
      <CollapsibleHeader>
        <CollapsibleTitle>{title}</CollapsibleTitle>
        <ToggleButton
          onClick={() => {
            setOpen(!IsOpen);
          }}
        >
          {IsOpen ? '-' : '+'}
        </ToggleButton>
      </CollapsibleHeader>
      <CollapsibleBody open={IsOpen}>{children}</CollapsibleBody>
    </div>
  );
};

export default Collapsible;
