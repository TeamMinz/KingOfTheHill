import styled from 'styled-components';

export const Well = styled.div`
    background-color: var(--secondary-background-color);
    margin: 0.5rem 0.5rem;
    border: solid 1px;
    border-color: var(--border-color);

    DropdownTrigger {
        color: red !important;
    }
`;

export const LiveConfigForm = styled.form`
    padding: 0.5rem;
`