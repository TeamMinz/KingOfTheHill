/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';
import { TabPanel } from 'react-tabs';

export const StyledQueuePanel = styled(TabPanel)`
  flex-grow: 1;
  display: flex !important;
`;

export const StyledApp = styled.div`
  font-family: Raleway;
  width: 100%;
  height: 100%;

  ${ props => props.format == 'mobile' && `
    font-size: 1.5rem;
  `}

  ${ props => props.format == 'panel' && `
    font-size: 1.2rem;
  `}

  ${ props => props.format == 'component' && `
    font-size: 1rem;
  `}

  ${ props => props.theme == 'dark' && `
    --text-color: #e5e3e8;
    --border-color: #6441a4;
    --secondary-border-color: #4b317a;
    --background-color: #232127;
    --secondary-background-color: #2c2931;
    --disabled-background: #1c1820;
    --disabled-foreground: #9c9a9e;
    background-color: var(--background-color);
    border-color: var(--border-color);
    color: var(--text-color);
  `}

  ${
    props => props.theme == 'light' && `
      --text-color: #000000;
      --border-color: #898980;
      --secondary-border-color: #707068;
      --background-color: #FFF;
      --secondary-background-color: #0fafaf;
      --disabled-background: #efefef;
      --disabled-foreground: #9c9a9e;
      background-color: var(--background-color);
      border-color: var(--border-color);
      color: var(--text-color);
  `}
`;
