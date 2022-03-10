import React from 'react';
import styled from '@emotion/styled';

const Styler = styled.div`
  width: 80%;
  margin: auto;
  margin-bottom: 30;
  @media (max-width: 680px) {
    width: 95%;
  }
`;

const Container = props => <Styler>{props.children}</Styler>;

export default Container;
