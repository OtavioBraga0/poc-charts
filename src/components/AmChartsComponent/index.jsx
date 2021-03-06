import React, { useCallback, useEffect, useRef } from "react";

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { highForecast, lowForecast, mockedData } from "../../data";

import { colors } from "../constants";
import { useState } from "react";
import moment from "moment";

import eventBulletIcon from "../../assets/eventBulletIcon.svg";

am4core.useTheme(am4themes_animated);

export const AmChartsComponent = () => {
  const amChart = useRef();
  const [height, setHeight] = useState(800);
  const [toggleEventForm, setToggleEventForm] = useState(false);
  const [selectedBullet, setSelectedBullet] = useState({ total: 0, date: "" });
  const [selectedEvent, setSelectedEvent] = useState("Add Staff");
  const [selectedEventBullet, setSelectedEventBullet] = useState({
    date: "",
    total: 0,
  });

  useEffect(() => {
    amChart.current = am4core.create("chartdiv", am4charts.XYChart);

    return () => {
      if (amChart.current) {
        amChart.current.dispose();
      }
    };
  }, [amChart]);

  const handleDragMove = useCallback(
    (target, point, series, valueAxis, scrubber) => {
      const dataItem = valueAxis.getSeriesDataItem(
        target.baseSprite.series.values[0],
        point
      );
      if (series.bullets.values[0]) {
        const bullet = series.bullets.values[0]._clones.getIndex(
          dataItem.component.tooltipDataItem.index
        );
        if (bullet) {
          bullet.setElement(scrubber.element);
          setSelectedBullet(bullet.dataItem.dataContext);
        }
      }
    },
    []
  );

  const handleDrawChart = useCallback((series, scrubber) => {
    const pointIndex = mockedData.findIndex(
      (data) => data.date === moment().format("YYYY-MM-DD")
    );
    series.dummyData = { ...series.dummyData, pointIndex };

    const bullet = series.bullets.values[0]._clones.getIndex(pointIndex);
    if (bullet) {
      bullet.setElement(scrubber.element);
      setSelectedBullet(bullet.dataItem.dataContext);
    }
  }, []);

  useEffect(() => {
    if (amChart.current) {
      const chart = amChart.current;

      if (chart) {
        chart.zoomOutButton.disabled = true;

        const cursor = new am4charts.XYCursor();
        cursor.lineY.disabled = true;
        cursor.behavior = "none";

        cursor.lineX.stroke = am4core.color(colors.grey500);
        cursor.lineX.strokeWidth = 1;
        cursor.lineX.strokeOpacity = 0.8;

        chart.cursor = cursor;

        const dateAxis = new am4charts.DateAxis();
        dateAxis.tooltip.label.fontFamily =
          "'Roboto', Helvetica, Arial, sans-serif";
        dateAxis.tooltip.label.fill = am4core.color(colors.blue500);
        dateAxis.tooltip.label.fontSize = 10;
        dateAxis.tooltip.background.fill = am4core.color(colors.sand500);
        dateAxis.tooltip.stroke = am4core.color(colors.blue500);
        dateAxis.tooltip.strokeWidth = 1;

        const dateAxisRendered = chart.xAxes.push(dateAxis);
        dateAxisRendered.renderer.grid.template.disabled = true;
        dateAxisRendered.renderer.fontFamily =
          "'Roboto', Helvetica, Arial, sans-serif";
        dateAxisRendered.renderer.fontWeight = "700";
        dateAxisRendered.renderer.fontSize = 10;

        const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.renderer.grid.template.disabled = true;
        valueAxis.renderer.fontFamily =
          "'Roboto', Helvetica, Arial, sans-serif";
        valueAxis.renderer.fontWeight = "700";
        valueAxis.renderer.fontSize = 10;
        valueAxis.tooltip = false;

        valueAxis.getSeriesDataItem = function (series, position) {
          const key = this.axisFieldName + this.axisLetter;
          const value = this.positionToValue(position);
          const dataItem = series.dataItems.getIndex(
            series.dataItems.findClosestIndex(
              value,
              (x) => {
                return x[key] ? x[key] : undefined;
              },
              "any"
            )
          );
          return dataItem;
        };

        const series = new am4charts.LineSeries();
        series.data = mockedData;
        series.dataFields.valueY = "total";
        series.dataFields.dateX = "date";
        series.name = "series";
        series.strokeWidth = 2;
        series.stroke = am4core.color(colors.blue500);
        series.fillOpacity = 0.5;

        series.tooltipHTML = `<li>Past / Projected Data: <b>{total}</b></li>`;
        series.tooltip.getFillFromObject = false;
        series.tooltip.background.fill = am4core.color(colors.sand500);
        series.tooltip.label.fill = am4core.color(colors.blue500);
        series.tooltip.label.fontFamily =
          "'Roboto', Helvetica, Arial, sans-serif";
        series.tooltip.label.fontSize = 12;
        series.tooltip.stroke = am4core.color(colors.blue500);
        series.tooltip.strokeWidth = 2;
        series.tensionX = 0.8;
        series.tensionY = 1;

        series.bullets.push(new am4charts.Bullet());

        chart.series.push(series);

        const gradient = new am4core.LinearGradient();
        gradient.rotation = 90;
        gradient.addColor(am4core.color(colors.green500, 0.5));
        gradient.addColor(am4core.color(colors.sand500));

        series.fill = gradient;

        const range = valueAxis.createSeriesRange(series);
        range.value = 0;
        range.endValue = -100000000;
        range.contents.stroke = am4core.color(colors.errorStroke);
        range.contents.fill = am4core.color(colors.error);
        range.contents.fillOpacity = 0.3;

        const forecastHighRangeSeries = new am4charts.LineSeries();
        forecastHighRangeSeries.data = highForecast;
        forecastHighRangeSeries.dataFields.valueY = "total";
        forecastHighRangeSeries.dataFields.dateX = "date";
        forecastHighRangeSeries.name = "high forecast";
        forecastHighRangeSeries.strokeWidth = 2;
        forecastHighRangeSeries.stroke = am4core.color(colors.grey500);
        chart.series.push(forecastHighRangeSeries);

        const forecastLowRangeSeries = new am4charts.LineSeries();
        forecastLowRangeSeries.data = lowForecast;
        forecastLowRangeSeries.dataFields.valueY = "total";
        forecastLowRangeSeries.dataFields.dateX = "date";
        forecastLowRangeSeries.name = "low forecast";
        forecastLowRangeSeries.strokeWidth = 2;
        forecastLowRangeSeries.stroke = am4core.color(colors.grey500);
        chart.series.push(forecastLowRangeSeries);

        const scrollbarX = new am4charts.XYChartScrollbar();
        scrollbarX.series.push(series);
        scrollbarX.unselectedOverlay.fill = am4core.color("#fff");
        scrollbarX.unselectedOverlay.fillOpacity = 0.8;

        chart.scrollbarX = scrollbarX;
        chart.scrollbarX.parent = chart.bottomAxesContainer;

        const { startGrip, endGrip } = chart.scrollbarX;

        startGrip.background.disabled = true;
        endGrip.background.disabled = true;

        const startGripImg = startGrip.createChild(am4core.Rectangle);
        startGripImg.width = 10;
        startGripImg.height = 15;
        startGripImg.fill = am4core.color(colors.sand500);
        startGripImg.align = "center";
        startGripImg.valign = "middle";
        startGripImg.zIndex = 2;
        startGripImg.strokeWidth = 1;
        startGripImg.stroke = am4core.color(colors.blue500);

        // Add vertical bar
        const startLine = startGrip.createChild(am4core.Rectangle);
        startLine.height = 60;
        startLine.width = 1;
        startLine.fill = am4core.color(colors.grey500);
        startLine.align = "center";
        startLine.valign = "middle";
        startLine.zIndex = 1;

        const endGripImg = endGrip.createChild(am4core.Rectangle);
        endGripImg.width = 10;
        endGripImg.height = 15;
        endGripImg.fill = am4core.color(colors.sand500);
        endGripImg.align = "center";
        endGripImg.valign = "middle";
        endGripImg.zIndex = 2;
        endGripImg.strokeWidth = 1;
        endGripImg.stroke = am4core.color(colors.blue500);

        const endLine = endGrip.createChild(am4core.Rectangle);
        endLine.height = 60;
        endLine.width = 1;
        endLine.fill = am4core.color(colors.grey500);
        endLine.align = "center";
        endLine.valign = "middle";
        endLine.zIndex = 1;

        const scrubber = new am4charts.Bullet();

        const mainBullet = scrubber.createChild(am4charts.CircleBullet);
        mainBullet.stroke = am4core.color(colors.blue500);
        mainBullet.strokeWidth = 2;
        mainBullet.circle.radius = 5;
        mainBullet.fill = am4core.color(colors.sand500);

        const arrowRight = scrubber.createChild(am4charts.CircleBullet);
        arrowRight.fill = am4core.color("white");
        arrowRight.strokeWidth = 0;
        arrowRight.circle.radius = 5;
        arrowRight.dx = 20;
        arrowRight.horizontalCenter = "middle";
        arrowRight.verticalCenter = "middle";

        const arrowRightImage = arrowRight.createChild(am4core.Image);
        arrowRightImage.path = "M0.999969 7L3.99997 4L0.999969 1";
        arrowRightImage.stroke = am4core.color(colors.blue500);
        arrowRightImage.fill = am4core.color(colors.blue500);
        arrowRightImage.dy = -4;
        arrowRightImage.dx = -2;

        const arrowLeft = scrubber.createChild(am4charts.CircleBullet);
        arrowLeft.fill = am4core.color("white");
        arrowLeft.strokeWidth = 0;
        arrowLeft.circle.radius = 5;
        arrowLeft.dx = -20;

        const arrowLeftImage = arrowLeft.createChild(am4core.Image);
        arrowLeftImage.path = "M0.999969 7L3.99997 4L0.999969 1";
        arrowLeftImage.stroke = am4core.color(colors.blue500);
        arrowLeftImage.fill = am4core.color(colors.blue500);
        arrowLeftImage.rotation = 180;
        arrowLeftImage.dy = 4;
        arrowLeftImage.dx = 2;

        const eventBullet = series.bullets.push(new am4core.Image());
        eventBullet.href = eventBulletIcon;
        eventBullet.disabled = true;
        eventBullet.width = 20;
        eventBullet.height = 20;
        eventBullet.propertyFields.disabled = "disabledBullet";
        eventBullet.horizontalCenter = "middle";
        eventBullet.verticalCenter = "middle";

        eventBullet.events.on(
          "hit",
          ({ target }) => {
            setSelectedEventBullet(target.dataItem.dataContext);
          },
          this
        );

        chart.plotContainer.dragStart = ({ event }) => {
          event.preventDefault();
          event.stopImmediatePropagation();
        };
        chart.plotContainer.handleDragMove = ({ event }) => {
          event.preventDefault();
          event.stopImmediatePropagation();
        };
        chart.plotContainer.dragStop = ({ event }) => {
          event.preventDefault();
          event.stopImmediatePropagation();
        };

        series.events.on(
          "appeared",
          () => handleDrawChart(series, scrubber),
          this
        );

        chart.plotContainer.events.on(
          "drag",
          ({ target, point }) =>
            handleDragMove(target, point, series, valueAxis, scrubber),
          this
        );

        chart.plotContainer.events.on(
          "hit",
          ({ target, point }) =>
            handleDragMove(target, point, series, valueAxis, scrubber),
          this
        );

        chart.events.on("appeared", () => {
          dateAxis.zoomToDates(
            moment().subtract(1, "months").toDate(),
            moment().add(1, "months").toDate()
          );
        });
      }
    }
  }, [amChart, handleDragMove, handleDrawChart]);

  const handleAddNewEvent = useCallback(
    (event) => {
      event.preventDefault();
      const draftMockedData = mockedData;
      const selectedDataIndex = draftMockedData.findIndex(
        (data) => data === selectedBullet
      );

      draftMockedData[selectedDataIndex] = {
        ...selectedBullet,
        event: selectedEvent,
        disabledBullet: false,
      };
      amChart.current.series.values[0].data = mockedData;
      amChart.current.series.values[0].appear();
    },
    [selectedBullet, selectedEvent]
  );

  return (
    <>
      <div id="chartdiv" style={{ height }} />
      <button onClick={() => setHeight((prev) => (prev === 500 ? 800 : 500))}>
        Toggle Height
      </button>
      <button onClick={() => setToggleEventForm((prev) => !prev)}>
        Toggle Event Form
      </button>
      <br />

      <span style={{ display: "flex", alignItems: "center" }}>
        <h3 style={{ marginRight: 15, marginTop: 10, marginBottom: 10 }}>
          Scrubber Value
        </h3>
        {selectedBullet.total}
      </span>

      <span style={{ display: "flex", alignItems: "center" }}>
        <h3 style={{ marginRight: 15, marginTop: 10, marginBottom: 10 }}>
          Selected Event Bullet Value
        </h3>
        {selectedEventBullet.total}
      </span>
      {toggleEventForm && (
        <form
          onSubmit={handleAddNewEvent}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 15,
            width: 300,
          }}
        >
          <div>
            <label style={{ marginRight: 15 }}>Event</label>
            <select
              onChange={(event) => setSelectedEvent(event.target.value)}
              value={selectedEvent}
            >
              <option value="Add Staff">Add Staff</option>
              <option value="Remove Staff">Remove Staff</option>
              <option value="Add Client">Add Client</option>
              <option value="Remove Client">Remove Client</option>
            </select>
          </div>
          <div>
            <label style={{ marginRight: 15 }}>Total</label>
            <input type="text" value={selectedBullet.total} disabled />
          </div>
          <div>
            <label style={{ marginRight: 15 }}>Date</label>
            <input type="date" value={selectedBullet.date} disabled />
          </div>
          <button type="submit">Add Event</button>
        </form>
      )}
    </>
  );
};
