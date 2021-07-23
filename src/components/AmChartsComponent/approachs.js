/*
 *
 * PLOT BULLETS IN ALL POINT IN SERIES
 *
 */
// series.dummyData = {...series.dummyData, selectedBullet: null}
// chart.plotContainer.events.on("hit", ({target, point}) => {
//     const dataItem = valueAxis.getSeriesDataItem(target.baseSprite.series.values[0], point)
//     const bullet = series.bullets.values[0]._clones.getIndex(dataItem.component.tooltipDataItem.index)
//     const {selectedBullet} = series.dummyData
//     if (selectedBullet) selectedBullet.opacity = 0
//     if (bullet) bullet.opacity = 1
//     series.dummyData.selectedBullet = bullet
// }, this)

/*
 *
 * MOVE PLOT ON HIT
 *
 */
// chart.plotContainer.events.on("hit", ({target, point}) => {
//     const dataItem = valueAxis.getSeriesDataItem(target.baseSprite.series.values[0], point)
//     if (series.bullets.values[0]) {
//       const bullet = series.bullets.values[0]._clones.getIndex(dataItem.component.tooltipDataItem.index)
//       if (bullet) {
//         console.log(bullet);
//         const {x, y} = bullet
//         plot.moveTo({x, y})
//       }
//     }
//   }, this)

//   scrollbarX.events.on("rangechanged", ({ target }) => {
//     const dataItem = valueAxis.getSeriesDataItem(target.series.values[0], plot)
//     if (series.bullets.values[0]) {
//       const bullet = series.bullets.values[0]._clones.getIndex(dataItem.component.tooltipDataItem.index)
//       if (bullet) {
//         const {x, y} = bullet
//         plot.moveTo({x, y})
//       }
//     }
//   },this);
