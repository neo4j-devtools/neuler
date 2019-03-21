import React from 'react'
import { ResponsiveBarCanvas } from '@nivo/bar'

export default ({ data, style }) => {
  console.log('rendering with data', data)
  data.reverse()
  return <div style={style || { height: '50em' }}>
    <ResponsiveBarCanvas
      data={data}
      keys={['score']}
      indexBy="name"
      margin={{
        "top": 10,
        "right": 60,
        "bottom": 50,
        "left": 60
      }}
      enableGridX={false}
      enableGridY={true}
      enableLabel={true}
      labelTextColor="inherit:darker(1.6)"
      isInteractive={true}
      layout="horizontal"
      colors="accent"
      colorBy="score"
      padding={0.3}
    />
  </div>
}