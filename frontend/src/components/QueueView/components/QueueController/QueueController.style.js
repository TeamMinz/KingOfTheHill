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
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.5);

  transition: all 0.2s ease-in-out;

  &:hover {
    transform: translateY(-0.25em);
    box-shadow: 0px calc(2px + 0.25em) 2px rgba(0, 0, 0, 0.5);
  }

  &:active {
    transform: translateY(0.1em) !important;
    box-shadow: 0px 0px 0px 0px !important;
  }

  &:disabled {
    pointer-events: none;
    opacity: 0.8;
  }
`;

export const StyledShopButton = styled.button`
  border: unset;
  outline: unset;
  background-color: var(--secondary-background-color);
  color: var(--secondary-text-color);
  cursor: pointer;

  display: block;

  font-family: 'Nunito Sans';
  font-weight: 900;
  width: 2.5rem;
  height: 2.5rem;

  border-radius: 50%;
  margin-bottom: 0.25rem;
  margin-left: auto;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.5);
  align-self: flex-end;

  display: flex;
  align-items: center;
  justify-content: center;

  transition: all 0.2s ease-in-out;

  &:hover {
    transform: translateY(-0.25em);
    box-shadow: 0px calc(2px + 0.25em) 2px rgba(0, 0, 0, 0.5);
  }

  &:active {
    transform: translateY(0.1em) !important;
    box-shadow: 0px 0px 0px 0px !important;
  }
`;

export const StyledLeaderboardButton = styled.div`
  border: unset;
  outline: unset;
  background-color: var(--secondary-background-color);
  color: var(--secondary-text-color);
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 2.5rem;
  height: 2.5rem;

  border-radius: 50%;
  margin-bottom: 0.25rem;
  margin-right: auto;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.5);
  align-self: flex-end;

  transition: all 0.2s ease-in-out;

  &:hover {
    transform: translateY(-0.25em);
    box-shadow: 0px calc(2px + 0.25em) 2px rgba(0, 0, 0, 0.5);
  }

  &:active {
    transform: translateY(0.1em) !important;
    box-shadow: 0px 0px 0px 0px !important;
  }
`;

export const StyledControllerContainer = styled.div`
  display: flex;
`;
