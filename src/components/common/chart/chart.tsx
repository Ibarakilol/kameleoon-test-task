import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';
import { observer } from 'mobx-react-lite';

import ChartPopup from './components/chart-popup';
import ChartSettings from './components/chart-settings';

import chartStore from '@/stores/chart-store';

import { useResizeObserver } from '@/hooks';
import { exportHTMLToPNG } from '@/utils';
import type { IChartLine, IChartPopupConversionRate, IChartPopupData } from '@/interfaces';

import './chart.scss';

const Chart = observer(() => {
  const {
    chartVariations,
    filteredChartData,
    selectedInterval,
    selectedLineStyle,
    clearStore,
    init,
  } = chartStore;
  const { linesData, variations } = filteredChartData;
  const [chartPopupData, setChartPopupData] = useState<IChartPopupData | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const hidePopup = useRef<(() => void) | null>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const zoomTransformRef = useRef(d3.zoomIdentity);
  const [dimensions, setDimensions] = useState({ height: 300, width: 1303 });
  const margin = useMemo(() => ({ top: 12, right: 15, bottom: 20, left: 35 }), []);

  const updateDimensions = useCallback(() => {
    if (!wrapperRef.current) {
      return;
    }

    const height = 300 - margin.top - margin.bottom;
    const width = wrapperRef.current.getBoundingClientRect().width - margin.left - margin.right;

    setDimensions({ height, width });
  }, [margin]);

  useResizeObserver(wrapperRef, updateDimensions);

  const handleExportChart = async () => {
    await exportHTMLToPNG(wrapperRef, 'chart');
  };

  const handleChartZoom = (zoom: 'in' | 'out' | 'reset') => {
    if (!zoomRef.current || !svgRef.current) {
      return;
    }

    const selection = d3.select(svgRef.current).transition().duration(250);
    const currentTransform = zoomTransformRef.current;
    let newScale: number;

    const resetZoom = () => {
      selection.call(zoomRef.current!.transform, d3.zoomIdentity);
      zoomTransformRef.current = d3.zoomIdentity;
    };

    switch (zoom) {
      case 'in':
        newScale = Math.min(8, currentTransform.k * 1.3);
        selection.call(zoomRef.current.scaleTo, newScale);
        break;
      case 'out':
        newScale = Math.max(1, currentTransform.k * 0.7);

        if (newScale <= 1.1) {
          resetZoom();
        } else {
          selection.call(zoomRef.current.scaleTo, newScale);
        }

        break;
      case 'reset':
        resetZoom();
        break;
      default:
        return;
    }
  };

  useEffect(() => {
    void init();
    updateDimensions();

    return () => {
      clearStore();
    };
  }, [clearStore, init, updateDimensions]);

  useEffect(() => {
    if (!wrapperRef.current || !svgRef.current) {
      return;
    }

    d3.select(svgRef.current).selectAll('*').remove();

    const { height, width } = dimensions;

    const svg = d3
      .select(svgRef.current)
      .attr('width', '100%')
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    zoomRef.current = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 8])
      .translateExtent([
        [0, 0],
        [width, height],
      ])
      .on('zoom', (evt) => {
        zoomTransformRef.current = evt.transform;
        const newX = evt.transform.rescaleX(xScale);

        svg.select<SVGGElement>('.chart__x-axis').call(xAxis.scale(newX));

        svg.selectAll<SVGPathElement, IChartLine[]>('path.chart__line').attr('d', (datum) =>
          d3
            .line<IChartLine>()
            .x(({ date }) => newX(date))
            .y(({ conversionRate }) => yScale(conversionRate))
            .curve(selectedLineStyle === 'smooth' ? d3.curveMonotoneX : d3.curveLinear)(datum)
        );

        svg.selectAll<SVGPathElement, IChartLine[]>('path.chart__area').attr('d', (datum) =>
          d3
            .area<IChartLine>()
            .x(({ date }) => newX(date))
            .y0(height)
            .y1(({ conversionRate }) => yScale(conversionRate))
            .curve(d3.curveMonotoneX)(datum)
        );
      });

    d3.select(svgRef.current).call(zoomRef.current!);

    const chartArea = svg
      .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', width)
      .attr('height', height)
      .style('fill', 'none')
      .style('stroke', '#e1dfe7')
      .style('stroke-width', 1)
      .style('pointer-events', 'all');

    const linesDataDates = linesData.flatMap(({ values }) => values.map(({ date }) => date));
    const linesDataConversionRates = linesData.flatMap(({ values }) =>
      values.map(({ conversionRate }) => conversionRate)
    );

    const xScale = d3
      .scaleTime()
      .domain(d3.extent(linesDataDates) as [Date, Date])
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(linesDataConversionRates) || 100])
      .range([height, 0])
      .nice();

    const xAxis = d3
      .axisBottom(xScale)
      .ticks(selectedInterval === 'day' ? d3.timeDay.every(1) : d3.timeWeek.every(1))
      .tickFormat(d3.timeFormat('%b %d') as any)
      .tickSize(0)
      .tickPadding(8);

    const yAxis = d3
      .axisLeft(yScale)
      .tickFormat((domainValue) => `${domainValue}%`)
      .tickSize(0)
      .tickPadding(8);

    svg
      .append('g')
      .attr('class', 'chart__x-axis')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis);
    svg.append('g').attr('class', 'chart__y-axis').call(yAxis);
    svg.selectAll('.domain').remove();

    const hoverLine = svg
      .append('line')
      .style('stroke', '#e1dfe7')
      .style('stroke-width', 1)
      .style('stroke-dasharray', '5')
      .style('opacity', 0)
      .style('pointer-events', 'none');

    const bisectDate = d3.bisector((lineData: any) => lineData.date).left;

    const updatePopup = (evt: any) => {
      const [xCoord] = d3.pointer(evt);
      const hoverDate = xScale.invert(xCoord);
      const conversionRates: IChartPopupConversionRate[] = [];
      let dateValue = '';
      let xAxisValue = 0;
      let yAxisValue = 0;

      linesData.forEach(({ id, values }) => {
        if (!values.length) {
          return;
        }

        const idx = bisectDate(values, hoverDate, 0, values.length - 1);
        const prevData = values[Math.max(0, idx - 1)];
        const currentData = values[idx];
        const { conversionRate, date } = !idx
          ? currentData
          : idx === values.length
            ? prevData
            : hoverDate.getTime() - prevData.date.getTime() >
                currentData.date.getTime() - hoverDate.getTime()
              ? currentData
              : prevData;

        if (!conversionRates.length) {
          dateValue = d3.timeFormat('%d/%m/%Y')(date);
          xAxisValue = xScale(date);
          yAxisValue = yScale(conversionRate);
        }

        const variationName =
          chartVariations.find((chartVariation) => {
            if ('id' in chartVariation) {
              return chartVariation.id?.toString() === id;
            }

            return id === '0';
          })?.name ?? id;
        conversionRates.push({ conversionRate, variationName, variationColor: colorScheme(id) });
      });

      if (conversionRates.length) {
        const sortedConversionRates = conversionRates.sort(
          (a, b) => b.conversionRate - a.conversionRate
        );

        setChartPopupData({
          conversionRates: sortedConversionRates,
          date: dateValue,
          xAxis: xAxisValue,
          yAxis: yAxisValue,
        });

        hoverLine
          .attr('x1', xAxisValue)
          .attr('x2', xAxisValue)
          .attr('y1', 0)
          .attr('y2', height)
          .style('opacity', 1);
      }
    };

    hidePopup.current = () => {
      setTimeout(() => {
        if (!popupRef.current?.matches(':hover')) {
          setChartPopupData(null);
          hoverLine.style('opacity', 0);
        }
      }, 100);
    };

    chartArea.on('mousemove', updatePopup).on('mouseleave', hidePopup.current);

    const colorScheme = d3.scaleOrdinal<string>().domain(variations).range(d3.schemeCategory10);

    linesData.forEach(({ id, values }) => {
      const lineColor = colorScheme(id);

      if (selectedLineStyle === 'area') {
        const area = d3
          .area<IChartLine>()
          .x(({ date }) => xScale(date))
          .y0(height)
          .y1(({ conversionRate }) => yScale(conversionRate))
          .curve(d3.curveMonotoneX);

        svg
          .append('path')
          .datum(values)
          .attr('class', 'chart__area')
          .attr('d', area)
          .style('fill', lineColor)
          .style('fill-opacity', 0.3)
          .style('stroke', lineColor)
          .style('stroke-width', 1)
          .style('pointer-events', 'none');
      } else {
        const line = d3
          .line<IChartLine>()
          .x(({ date }) => xScale(date))
          .y(({ conversionRate }) => yScale(conversionRate))
          .curve(selectedLineStyle === 'smooth' ? d3.curveMonotoneX : d3.curveLinear);

        svg
          .append('path')
          .datum(values)
          .attr('class', 'chart__line')
          .attr('d', line)
          .style('stroke', lineColor)
          .style('fill', 'none')
          .style('stroke-width', 2)
          .style('pointer-events', 'none');
      }
    });
  }, [
    chartVariations,
    dimensions,
    linesData,
    margin,
    selectedInterval,
    selectedLineStyle,
    variations,
  ]);

  return (
    <div className="chart">
      <ChartSettings
        handleExportChart={handleExportChart}
        handleZoomIn={() => handleChartZoom('in')}
        handleZoomOut={() => handleChartZoom('out')}
        handleZoomReset={() => handleChartZoom('reset')}
      />

      <div className="chart__wrapper" ref={wrapperRef}>
        <svg ref={svgRef} />
        {chartPopupData && (
          <ChartPopup
            ref={popupRef}
            chartPopupData={chartPopupData}
            handleMouseLeave={hidePopup.current!}
          />
        )}
      </div>
    </div>
  );
});

export default Chart;
