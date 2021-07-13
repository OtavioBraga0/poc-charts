import React, { useEffect, useRef, useState } from 'react';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { highForecast, lowForecast, mockedData as data } from '../../data';

import {colors} from '../constants'

am4core.useTheme(am4themes_animated);

export const AmChartsComponent = () => {
    const amChart = useRef()

    const point = useRef() 

    const [prevBullet, setPrevBullet] = useState()

    useEffect(() => {
        amChart.current = am4core.create("chartdiv", am4charts.XYChart)
    }, [amChart])

    useEffect(() => {
        if (amChart.current) {
            const chart = amChart.current
            
            chart.paddingRight = 20;
            chart.zoomOutButton.disabled = true;

            const cursor = new am4charts.XYCursor();
            cursor.lineX.disabled = false
            cursor.lineY.disabled = true
            cursor.behavior = "none"

            cursor.lineX.stroke = am4core.color(colors.grey500);
            cursor.lineX.strokeWidth = 1;
            cursor.lineX.strokeOpacity = 0.8;
            cursor.lineX.strokeDasharray = "";

            chart.cursor = cursor

            const dateAxis = chart.xAxes.push(new am4charts.DateAxis())
            dateAxis.renderer.grid.template.disabled = true
            dateAxis.renderer.fontFamily = "'Roboto', Helvetica, Arial, sans-serif"
            dateAxis.renderer.fontWeight = '700'
            dateAxis.renderer.fontSize = 10
            dateAxis.renderer.fontColor = am4core.color(colors.blue500)
            
            dateAxis.tooltip.label.fontFamily = "'Roboto', Helvetica, Arial, sans-serif"
            dateAxis.tooltip.label.fill = am4core.color(colors.blue500)
            dateAxis.tooltip.label.fontSize = 10
            dateAxis.tooltip.background.fill = am4core.color(colors.sand500)
            dateAxis.tooltip.stroke = am4core.color(colors.blue500)
            dateAxis.tooltip.strokeWidth = 1
            
            const valueAxis = chart.yAxes.push(new am4charts.ValueAxis())
            valueAxis.renderer.grid.template.disabled = true;
            valueAxis.renderer.fontFamily = "'Roboto', Helvetica, Arial, sans-serif"
            valueAxis.renderer.fontWeight = '700'
            valueAxis.renderer.fontSize = 10
            valueAxis.renderer.fontColor = am4core.color(colors.blue500)
            valueAxis.tooltip.disabled = true;
            valueAxis.strictMinMax = true
            valueAxis.extraMin = 0.2;
            valueAxis.extraMax = 0.2; 
   
            const series = new am4charts.LineSeries();
            series.data = data
            series.dataFields.valueY = "total";
            series.dataFields.dateX = "date";
            series.name = "series";
            series.strokeWidth = 2;
            series.stroke = am4core.color(colors.blue500)
            series.fillOpacity = 1;

            series.tooltipHTML = `<li>Past / Projected Data: <b>{total}</b></li>`
            series.tooltip.getFillFromObject = false
            series.tooltip.background.fill = am4core.color(colors.sand500)
            series.tooltip.label.fill = am4core.color(colors.blue500)
            series.tooltip.label.fontFamily = "'Roboto', Helvetica, Arial, sans-serif"
            series.tooltip.label.fontSize = 12
            series.tooltip.stroke = am4core.color(colors.blue500)
            series.tooltip.strokeWidth = 2

            chart.series.push(series)
            
            const gradient = new am4core.LinearGradient()
            gradient.rotation = 90
            gradient.addColor(am4core.color(colors.green500))
            gradient.addColor(am4core.color(colors.sand500))

            series.fill = gradient

            const range = valueAxis.createSeriesRange(series);
            range.value = 0;
            range.endValue = -10000000;
            range.contents.stroke = am4core.color(colors.error);

            const negativeGradient = new am4core.LinearGradient()            
            negativeGradient.addColor(am4core.color(colors.sand500))
            negativeGradient.addColor(am4core.color(colors.error))
            range.contents.fill = negativeGradient;

            const forecastHighRangeSeries = new am4charts.LineSeries();
            forecastHighRangeSeries.data = highForecast
            forecastHighRangeSeries.dataFields.valueY = "total";
            forecastHighRangeSeries.dataFields.dateX = "date";
            forecastHighRangeSeries.name = "high forecast";
            forecastHighRangeSeries.strokeWidth = 1;
            forecastHighRangeSeries.stroke = am4core.color(colors.grey500)
            forecastHighRangeSeries.tensionX = .7
            chart.series.push(forecastHighRangeSeries)

            const forecastLowRangeSeries = new am4charts.LineSeries();
            forecastLowRangeSeries.data = lowForecast
            forecastLowRangeSeries.dataFields.valueY = "total";
            forecastLowRangeSeries.dataFields.dateX = "date";
            forecastLowRangeSeries.name = "low forecast";
            forecastLowRangeSeries.strokeWidth = 1;
            forecastLowRangeSeries.stroke = am4core.color(colors.grey500)
            forecastLowRangeSeries.tensionX = .7
            chart.series.push(forecastLowRangeSeries)

            const scrollbarX = new am4charts.XYChartScrollbar()
            scrollbarX.series.push(series)
            scrollbarX.series.push(forecastLowRangeSeries)
            scrollbarX.series.push(forecastHighRangeSeries)
            scrollbarX.end = .45
            scrollbarX.start =  .55
            scrollbarX.thumb.background.fill = am4core.color(colors.green500)
            scrollbarX.unselectedOverlay.fill = am4core.color("#fff");
            scrollbarX.unselectedOverlay.fillOpacity = .8;

            chart.scrollbarX = scrollbarX
            chart.scrollbarX.parent = chart.bottomAxesContainer

            const {startGrip, endGrip} = chart.scrollbarX

            startGrip.background.disabled = true;
            endGrip.background.disabled = true;
            
            const startGripImg = startGrip.createChild(am4core.Rectangle);
            startGripImg.width = 10;
            startGripImg.height = 15;
            startGripImg.fill = am4core.color(colors.sand500);
            startGripImg.align = "center";
            startGripImg.valign = "middle";
            startGripImg.zIndex = 2
            startGripImg.strokeWidth = 1
            startGripImg.stroke = am4core.color(colors.blue500)

            // Add vertical bar
            const startLine = startGrip.createChild(am4core.Rectangle);
            startLine.height = 60;
            startLine.width = 1;
            startLine.fill = am4core.color(colors.grey500);
            startLine.align = "center";
            startLine.valign = "middle";
            startLine.zIndex = 1

            const endGripImg = endGrip.createChild(am4core.Rectangle);
            endGripImg.width = 10;
            endGripImg.height = 15;
            endGripImg.fill = am4core.color(colors.sand500);
            endGripImg.align = "center";
            endGripImg.valign = "middle";
            endGripImg.zIndex = 2
            endGripImg.strokeWidth = 1
            endGripImg.stroke = am4core.color(colors.blue500)

            // Add vertical bar
            const endLine = endGrip.createChild(am4core.Rectangle);
            endLine.height = 60;
            endLine.width = 1;
            endLine.fill = am4core.color(colors.grey500);
            endLine.align = "center";
            endLine.valign = "middle";
            endLine.zIndex = 1
            
            const bullet = new am4charts.CircleBullet()
            bullet.stroke = am4core.color(colors.blue500)
            bullet.fill = am4core.color(colors.sand500)
            bullet.defaultState.properties.opacity = 0

            // bullet.events.on("hit", ({target}) => {
            //     setPrevBullet(prev => {
            //         console.log('prev ', prev);
            //         if (prev) {
            //             prev.opacity = 0
            //         }
            //         console.log('target', target);
            //         target.opacity = 1
            //         return target
            //     })
            // }, this)

            
            series.segments.template.interactionsEnabled = true
            series.segments.template.events.on("hit", ({target, ...rest}) => {
                const data = target.dataItem.component.tooltipDataItem.dataContext;
                const clones = target.dataItem.component.bullets.values[0].clones.values

                console.log(target);

                point.current = data
            },this);

            series.segments.template.events.on("drag", ({target, event, }) => {
                event.stopPropagation()
                event.preventDefault()
                const data = target.dataItem.component.tooltipDataItem.dataContext;
                point.current = data
            },this)


            series.bullets.push(bullet)
        }
    }, [amChart])

  return (
      <>
        <div id="chartdiv" style={{height: 600 }}/>
        <button type="button" onClick={() => console.log('point', point.current)}>Click!</button>
      </>
  )
}