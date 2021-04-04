import styled from 'styled-components';

export const StyledQueueButton = styled.button`
    border: unset;
    outline: unset;
    background-color: var(--secondary-background-color);
    color: var(--secondary-text-color);
    cursor: pointer;

    display: block;

    font-family: 'Nunito Sans';
    font-weight: 900;
    width: 6em;
    height: 6em;
    
    border-radius: 50%;
    padding-left: 1.5em;
    padding-right: 1.5em;
    margin-bottom: 1em;
    margin-left: auto;
    margin-right: auto;
    box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.5);

    transition: all 0.2s ease-in-out;

    &:hover {
        transform: translateY(-0.25em);
        box-shadow: 0px calc(2px + 0.25em) 2px rgba(0, 0, 0, 0.5);
    }

    &:active {
        transform: translateY(0) !important;
        box-shadow: 0px 0px 0px 0px !important;
    }
`;