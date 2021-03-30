/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';
import { TabPanel } from 'react-tabs';

export const StyledQueuePanel = styled(TabPanel)`
  flex-grow: 1;
  display: flex !important;
`;

export const StyledApp = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  border: solid 5px;
  

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
    --text-color: #fff;
    --border-color: #4B4B4B;
    --background-color: #3D3D3D;
    --secondary-background-color: #7D5FFF;
    background-color: var(--background-color);
    border-color: var(--border-color);
    color: var(--text-color);
    box-shadow: inset 0px 3px 3px rgba(0, 0, 0, 0.25);
  `}

  ${
    props => props.theme == 'light' && `
      --text-color: #232127;
      --secondary-text-color: #E5E3E8; 
      --border-color: #E5E3E8;
      --background-color: #FFFAFA;
      --secondary-background-color: #6441A4;
      background-color: var(--background-color);
      border-color: var(--border-color);
      color: var(--text-color);
      box-shadow: inset 0px 3px 3px rgba(0, 0, 0, 0.5);
  `}
`;
