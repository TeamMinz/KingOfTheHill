import styled from 'styled-components';

export const Well = styled.div`
  margin: 0.5rem 0.5rem;
  border: solid 1px;
  border-color: var(--border-color);

  DropdownTrigger {
    color: red !important;
  }
`;

export const LiveConfigForm = styled.form`
  padding: 0.5rem;
`;

export const StyledCheckbox = styled.input`
  margin-left: auto;
`;

export const StyledNumberSpinner = styled.input`
  width: 3rem;
  margin-left: auto;
`;

export const StyledFormRow = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

export const StyledLiveConfigPage = styled.div`
  ${(props) => props.theme === 'dark'
    && `
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

  ${(props) => props.theme === 'light'
    && `
        --text-color: #000000;
        --border-color: #6441a4;
        --secondary-border-color: #707068;
        --background-color: #FFF;
        --secondary-background-color: #afafaf;
        --disabled-background: #efefef;
        --disabled-foreground: #9c9a9e;
        background-color: var(--background-color);
        border-color: var(--border-color);
        color: var(--text-color);
    `}

    font-family: Raleway;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  padding: 5px;
  color: var(--text-color);
  background-color: var(--background-color);
`;

export const StyledFormLabel = styled.label``;

export const StyledFormContainer = styled.div`
  text-align: left;
  margin: 0.5rem;
`;
