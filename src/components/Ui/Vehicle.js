import React from 'react';
import styled from '@emotion/styled';
import Bmw from '../../assets/images/eloop-bmw.png';
import Moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';
import i18n from '../../i18n';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  padding: 1.25em 0.25em;
  box-shadow: 0 0.46875rem 2.1875rem rgba(8, 10, 37, 0.03),
    0 0.9375rem 1.40625rem rgba(8, 10, 37, 0.03),
    0 0.25rem 0.53125rem rgba(8, 10, 37, 0.05),
    0 0.125rem 0.1875rem rgba(8, 10, 37, 0.03);

  border: 1px solid rgba(32, 39, 140, 0.125);
  border-radius: 0.25rem;
`;
const Active = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 25px;
`;
const Plate = styled.div`
  background-color: white;
  font-weight: bold;
  font-size: 1.2em;
`;
const Span = styled.span`
  font-weight: 700;
  text-transform: uppercase;
  padding: 5px 10px;
  min-width: 19px;
  color: #fff;
  background-color: rgb(74, 222, 181);
  display: inline-block;
  padding: 0.25em 0.4em;
  font-size: 75%;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  vertical-align: initial;
  border-radius: 0.25rem;
  -webkit-transition: color 0.15s ease-in-out,
    background-color 0.15s ease-in-out, border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
`;
const SecondRow = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  padding: 10px;
  div p {
    font-size: 0.7em;
    text-transform: uppercase;
    text-align: center;
    opacity: 0.5;
  }
  div span {
    font-weight: bold;
  }
`;

const durationFormatter = cell => {
  if (cell) {
    return Moment.duration(Number(cell.toFixed(0)), 'minutes').format(
      'H:mm:ss'
    );
  } else return 0;
};

const Vehicle = data => (
  <Container>
    <Active>
      <img
        src={Bmw}
        alt='Eloop Bmwi3'
        style={{ paddingRight: '20px', width: '196px', height: '82px' }}
      />
      <div className='textvehicle'>
        {data.data.status ? (
          <>
            <div className='dot'>
              <div className='dot-pulse' />
            </div>
            <Span>{i18n.t('Active')}</Span>
          </>
        ) : (
          <>
            <div className='dot-red'>
              <div className='dot-red-pulse' />
            </div>
            <Span>{i18n.t('Not Active')}</Span>
          </>
        )}
        <Plate>{data.data.plate}</Plate>
      </div>
    </Active>
    <SecondRow>
      <div>
        <span>{data.data.totalKm} km</span>
        <p>{i18n.t('KM Driven')}</p>
      </div>
      <div>
        <span>€ {data.data.totalRevenue.toFixed(2)}</span>
        <p>{i18n.t('Total Revenue')}</p>
      </div>
      <div>
        <span>{durationFormatter(data.data.totalTime)} h</span>
        <p>{i18n.t('Hours Used')}</p>
      </div>
    </SecondRow>
    <SecondRow>
      <div>
        <span>{Math.ceil(data.data.totalKm * 3.3 * 0.165)} kg</span>
        <p>
          CO<sub>2</sub> Saved
        </p>
      </div>
      <div>
        <span>{data.data.totalCostEt} EOT</span>
        <p>{i18n.t('EOT Token Value')}</p>
      </div>
      <div>
        <span>€ {data.data.monthlyCostEur}</span>
        <p>{i18n.t('Monthly Cost')}</p>
      </div>
    </SecondRow>
    {/* <p>Total Cost: € {data.data.totalCostEur}</p> */}
    {/* <span>{console.log(data.data)}</span> */}
  </Container>
);

export default Vehicle;
