import { forwardRef, useRef } from 'react';

import CalendarIcon from '@/assets/icons/calendar.svg';
import TrophyIcon from '@/assets/icons/trophy.svg';

import { Position } from '@/constants';
import { useCombinedRefs, useElementPosition } from '@/hooks';
import type { ChartPopupProps } from './chart-popup.props';

import './chart-popup.scss';

const ChartPopup = forwardRef<HTMLDivElement, ChartPopupProps>(
  ({ chartPopupData, handleMouseLeave }, ref) => {
    const { conversionRates, date, xAxis, yAxis } = chartPopupData;
    const chartPopupRef = useRef<HTMLDivElement | null>(null);
    const chartPopupCombinedRefs = useCombinedRefs(ref, chartPopupRef);
    const chartPopupPosition = useElementPosition(chartPopupCombinedRefs, Position.RIGHT, 228);

    return (
      <div
        className="chart-popup"
        ref={chartPopupCombinedRefs}
        style={{
          left: chartPopupPosition === Position.RIGHT ? xAxis + 35 : xAxis - 228 + 35,
          top: yAxis + 12,
        }}
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
