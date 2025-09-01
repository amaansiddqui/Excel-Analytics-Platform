import React from 'react';
import styled from 'styled-components';

const Loginbtn = ({text}) => {
  return (
    <StyledWrapper>
      <button className="cssbuttons-io-button">
        <span>{text}</span>
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .cssbuttons-io-button {
    display: flex;
    align-items: center;
    font-family: inherit;
    cursor: pointer;
    font-weight: 500;
    font-size: 16px;
    padding: 0.7em 1.4em 0.7em 1.1em;
    color: white;
    background: #ad5389;
    background: linear-gradient(
      0deg,
      rgba(40, 21, 133, 1) 0%,
      rgba(31, 57, 203, 1) 100%
    );
    border: none;
    box-shadow: 0 0.7em 1.5em -0.5em #14a73e98;
    letter-spacing: 0.05em;
    border-radius: 20em;
  }

  .cssbuttons-io-button svg {
    margin-right: 6px;
  }

  .cssbuttons-io-button:hover {
    box-shadow: 0 0.5em 1.5em -0.5em #14a73e98;
  }

  .cssbuttons-io-button:active {
    box-shadow: 0 0.3em 1em -0.5em #14a73e98;
  }`;

export default Loginbtn;
