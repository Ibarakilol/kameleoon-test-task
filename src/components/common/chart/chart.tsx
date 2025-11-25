import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { observer } from 'mobx-react-lite';

import ChartSettings from './components/chart-settings';

import chartStore from '@/stores/chart-store';
import type { IChartLine } from '@/interfaces';

import './chart.scss';

const Chart = observer(() => {
  const { chartData, selectedInterval, selectedLineStyle, selectedVariations, clearStore, init } =
    chartStore;
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    void init();

    return () => {
      clearStore();
    };
  }, [clearStore, init]);

  useEffect(() => {
    if (!wrapperRef.current || !svgRef.current) {
      return;
    }

    d3.select(svgRef.current).selectAll('*').remove();

    const chartDataVariations = Array.from(
      new Set(
        chartData.flatMap(({ conversions, visits }) => [
          ...Object.keys(conversions),
          ...Object.keys(visits),
        ])
      )
    );

    const filteredChartDataVariations = selectedVariations.length
      ? chartDataVariations.filter((variation) => selectedVariations.includes(variation))
      : chartDataVariations;

    const linesData = filteredChartDataVariations.map((variation) => ({
      id: variation,
      values: chartData.map(({ conversions, date, visits }) => ({
        date: new Date(date),
        conversionRate: ((conversions[variation] || 0) / (visits[variation] || 1)) * 100,
      })),
    }));

    const margin = { top: 12, right: 10, bottom: 20, left: 35 };
    const width = wrapperRef.current.getBoundingClientRect().width - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3
      .select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    svg
      .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', width)
      .attr('height', height)
      .style('fill', 'none')
      .style('stroke', '#e1dfe7')
      .style('stroke-width', 1);

    const linesDataDates = linesData.flatMap(({ values }) => values.map(({ date }) => date));

    const xScale = d3
      .scaleTime()
      .domain(d3.extent(linesDataDates) as [Date, Date])
      .range([0, width]);

    const linesDataConversionRates = linesData.flatMap(({ values }) =>
      values.map(({ conversionRate }) => conversionRate)
    );

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
      .attr('class', 'chart__axis')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis);
    svg.append('g').attr('class', 'chart__axis').call(yAxis);
    svg.selectAll('.domain').remove();

    const colorScheme = d3
      .scaleOrdinal<string>()
      .domain(filteredChartDataVariations)
      .range(d3.schemeCategory10);

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
          .style('stroke-width', 1);
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
          .style('stroke-width', 2);
      }
    });
  }, [chartData, selectedInterval, selectedLineStyle, selectedVariations]);

  return (
    <div className="chart">
      <ChartSettings />

      <div className="chart__wrapper" ref={wrapperRef}>
        <svg ref={svgRef} />
      </div>
    </div>
  );
});

export default Chart;
