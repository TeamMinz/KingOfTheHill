import React, { useState } from 'react';
import PropTypes from 'prop-types';
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

Collapsible.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  children: PropTypes.any.isRequired,
  title: PropTypes.string.isRequired,
  isOpen: PropTypes.bool,
};

Collapsible.defaultProps = {
  isOpen: false,
};

export default Collapsible;
