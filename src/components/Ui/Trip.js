import React from 'react';
import styled from '@emotion/styled';
import Moment from 'moment';
import { NODE_EXPLORER_URL } from '../../config';
import i18n from '../../i18n';

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  background-color: white;
  padding: 2em;
  margin: 2em 0;
  box-shadow: 0 0.46875rem 2.1875rem rgba(8, 10, 37, 0.03),
    0 0.9375rem 1.40625rem rgba(8, 10, 37, 0.03),
    0 0.25rem 0.53125rem rgba(8, 10, 37, 0.05),
    0 0.125rem 0.1875rem rgba(8, 10, 37, 0.03);
  border: 1px solid rgba(32, 39, 140, 0.125);
  border-radius: 0.25rem;
  @media (max-width: 660px) {
    padding: 1em;
    font-size: 0.75em;
  }
`;
const Values = styled.div`
  span {
    font-weight: bold;
    font-size: 1.2em;
  }
  p {
    font-size: 0.7em;
    opacity: 0.5;
    text-transform: uppercase;
  }
`;
const Link = styled.span`
  text-align: right;
  span {
    font-weight: bold;
  }
  p {
    font-size: 0.7em;
    opacity: 0.5;
    text-transform: uppercase;
    text-align: right;
  }
`;
const ChainLink = styled.a`
  color: #49deb5;
  opacity: 1;
  &:hover {
    color: #3db997;
  }
`;

const durationFormatter = (cell) => {
  return isNaN(cell)
    ? '0'
    : Moment.duration(Number(cell.toFixed(0)), 'minutes').format('H:mm:ss');
};
const dateFormatter = (cell) => {
  return cell.replace('T', ' ').replace('Z', '');
};
const txidFormatter = (cell) => {
  return cell !== undefined ? (
    <ChainLink href={`${NODE_EXPLORER_URL}${cell}`} target='_blank'>
      {i18n.t('View Transaction')}
    </ChainLink>
  ) : (
    <span style={{ color: '#f7b924' }}>{i18n.t('Processing')}</span>
  );
};

const Trip = (data) => (
  <Container>
    <Values>
      <span>{data.data.vehicle ? data.data.vehicle : 'N/A'}</span>
      <p>{i18n.t('License Plate')}</p>
      <p>{dateFormatter(data.data.startDateTime.iso)}</p>
    </Values>
    <Values>
      <span>€ {data.data.billingAmount.toFixed(2)}</span>
      <p>{i18n.t('Revenue')}</p>
    </Values>
    <Values>
      <span>{durationFormatter(data.data.duration)}</span>
      <p>{i18n.t('Duration')}</p>
    </Values>
    <Link>
      <span>{txidFormatter(data.data.txid)}</span>
      <p>{i18n.t('Blockchain proof')}</p>
      <p>
        <b>{data.data.Note}</b>
      </p>
    </Link>
  </Container>
);

export default Trip;
