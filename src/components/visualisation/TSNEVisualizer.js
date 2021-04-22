import React, { useEffect, useState } from "react"
import { ResponsiveScatterPlot } from '@nivo/scatterplot'
import TSNE from "tsne-js"

const cachedOutputs = {}

const generateTSNELayout = (data) => {
    const model = new TSNE({
        dim: 2,
        perplexity: 30.0,
        earlyExaggeration: 4.0,
        learningRate: 100.0,
        nIter: 300,
        metric: "euclidean",
    })

    model.init({
        data: data,
        type: "dense",
    })

    model.run()

    return model.getOutputScaled()
}

export default ({ taskId, result, completed }) => {
    if (!completed) {
        return false
    }

    const getCaption = (row) => {
        if (row.properties.name) {
            return row.properties.name
        }

        if (row.properties.title) {
            return row.properties.title
        }

        return row.identity

    }
    
    const [data, setData] = useState([])

    useEffect(
        () => {
            if (cachedOutputs[taskId]) {
                setData(cachedOutputs[taskId])
            } else {
                const scaledOutput = generateTSNELayout(
                    result.rows.map((row) => row.embedding),
                )
                let viz_input = result.rows
                    .map((row, i) => ({ label: row.labels[0], x: scaledOutput[i][0], y: scaledOutput[i][1], caption:getCaption(row) }))
                    .reduce((result, item) => { if (result.filter(element => element.id === item.label).length > 0) { 
                        result.find(element => element.id === item.label).data.push({ x: item.x, y: item.y, id:item.caption }) } 
                        else { result.push({ id: item.label, data: [{ x: item.x, y: item.y, id: item.caption }] }) }; 
                        return result }, [])
                cachedOutputs[taskId] = viz_input
                setData(viz_input)
            }
        },
        [taskId],
    )

    if (data.length === 0) {
        return <p>Computing t-SNE layout.</p>
    }

    return (
        <div style={{ height: '50em' }}>
            <ResponsiveScatterPlot
                data={data}
                margin={{ top: 60, right: 140, bottom: 70, left: 90 }}
                xScale={{ type: 'linear', min: -1, max: 1 }}
                yScale={{ type: 'linear', min: -1, max: 1 }}
                blendMode="multiply"
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    orient: 'bottom',
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                }}
                axisLeft={{
                    orient: 'left',
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                }}
                tooltip= {(node) => (
                    <div>
                    <strong>
                    {`Label: ${node.serie.id}`}
                    <br />
                    {`Id: ${node.serie.data[node.id.split(".")[1]].data.id}`}
                    </strong>
                    </div>
                )}
                legends={[
                    {
                        anchor: 'bottom-right',
                        direction: 'column',
                        justify: false,
                        translateX: 130,
                        translateY: 0,
                        itemWidth: 100,
                        itemHeight: 12,
                        itemsSpacing: 5,
                        itemDirection: 'left-to-right',
                        symbolSize: 12,
                        symbolShape: 'circle',
                        effects: [
                            {
                                on: 'hover',
                                style: {
                                    itemOpacity: 1
                                }
                            }
                        ]
                    }
                ]}
            />

        </div>
    )
}