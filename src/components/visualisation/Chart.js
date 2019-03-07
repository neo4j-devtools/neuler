import React from 'react'
import { ResponsiveBarCanvas } from '@nivo/bar'

export default ({ data }) => {
  data.reverse()
  return <div style={{ height: '50em' }}>
    <ResponsiveBarCanvas
      data={data}
      keys={['score']}
      indexBy="name"
      margin={{
        "top": 50,
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
      colors="red_grey"
      colorBy="score"
    />
  </div>
}