import styled from 'styled-components';

export const CollapsibleHeader = styled.div`
    text-align: left;
    display: flex;
    border-bottom: solid 1px var(--border-color);
    background-color: var(--secondary-background-color);
`;

export const CollapsibleTitle = styled.span`
    pointer-events: none;
    margin-left: 0.25rem;
    margin-top: 0.1rem;
`;

export const CollapsibleBody = styled.div`
    display: ${props => props.open ? 'block' : 'none'};
    background-color: var(--background-color);
`;

export const ToggleButton = styled.button`
    margin-left: auto;

    font-size: 1em;
    padding: 0.3em 0.6em;
    background-color: var(--border-color);
    border: none;
    outline: none;
    color: var(--text-color);
    text-align: center;
    text-decoration: none;
    cursor: pointer;
    font-family: Raleway;

    opacity: 0.8;
    box-shadow: black 0rem 0rem 0px;

    transition: 0.2s all;

    &:active {
        transform: translateY(0rem) !important;
        box-shadow: black 0rem 0rem 0px !important;
    }

    &:hover {
        transform: translateY(-0.2rem);
        box-shadow: black 0.0rem 0.2rem 0px;
        opacity: 1;
    }

    &:disabled {
        color: var(--disabled-foreground);
        background-color: var(--background-color);
        cursor: not-allowed;
        transform: translateY(0rem) !important;
        box-shadow: black 0rem 0rem 0px !important;
        opacity: 0.8 !important;
  }
`;