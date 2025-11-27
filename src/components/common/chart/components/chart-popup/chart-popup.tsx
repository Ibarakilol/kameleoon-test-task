import { forwardRef } from 'react';

import CalendarIcon from '@/assets/icons/calendar.svg';
import TrophyIcon from '@/assets/icons/trophy.svg';

import type { ChartPopupProps } from './chart-popup.props';

import './chart-popup.scss';

const ChartPopup = forwardRef<HTMLDivElement, ChartPopupProps>(
  ({ chartPopupData, handleMouseLeave }, ref) => {
    const { conversionRates, date, xAxis, yAxis } = chartPopupData;

    return (
      <div
        className="chart-popup"
        ref={ref}
        style={{ left: xAxis + 35, top: yAxis + 12 }}
        onMouseLeave={handleMouseLeave}
      >
        <div className="chart-popup__heading">
          <CalendarIcon className="chart-popup__heading-icon" />
          <span className="chart-popup__heading-date">{date}</span>
        </div>
        <div className="chart-popup__info scrollbar">
          {conversionRates.map(({ conversionRate, variationName, variationColor }, idx) => {
            return (
              <div className="chart-popup__info-item" key={variationName}>
                <div className="chart-popup__info-item-variation">
                  <span
                    className="chart-popup__info-item-color"
                    style={{ backgroundColor: variationColor }}
                  />
                  <span className="chart-popup__info-item-name">{variationName}</span>
                  {!idx && <TrophyIcon className="chart-popup__info-item-icon" />}
                </div>
                <span className="chart-popup__info-item-value">{`${conversionRate.toFixed(2)}%`}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

export default ChartPopup;
