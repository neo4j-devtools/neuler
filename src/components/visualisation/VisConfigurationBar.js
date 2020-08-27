import {Button, Form, Icon, Select} from "semantic-ui-react"
import React from "react"

export default ({ labels, captions, nodeSize, nodeColor, updateCaption, updateNodeSize, updateNodeColor, onUpdateConfig }) => {
  const allProps = flatMapProperties(labels)

  return (
    <Form>
      <Form.Group inline>
        {Object.keys(labels).map(label =>
          <Form.Field inline key={label}>
            <label>Caption for {label}</label>
            <Select placeholder='Select caption'
                    value={captions[label]}
                    options={Array.from(labels[label]).map(prop => ({ key: prop, value: prop, text: prop }))}
                    onChange={(evt, data) => updateCaption(label, data)}
            />
          </Form.Field>
        )}

        <Form.Field inline key='nodeSize'>
          <label>Node Size</label>
          <Select placeholder='Select node size'
                  value={nodeSize}
                  options={allProps.map(prop => ({ key: prop, value: prop, text: prop }))}
                  onChange={(evt, data) => updateNodeSize(data.value)}
          />
        </Form.Field>

        <Form.Field inline key='nodeColor'>
          <label>Node Color</label>
          <Select placeholder='Select node color'
                  value={nodeColor}
                  options={allProps.map(prop => ({ key: prop, value: prop, text: prop }))}
                  onChange={(evt, data) => updateNodeColor(data.value)}
          />
        </Form.Field>


        <Form.Field inline>
          <Button basic icon labelPosition='right' onClick={onUpdateConfig}>
            Refresh
            <Icon name='refresh'/>
          </Button>
        </Form.Field>
      </Form.Group>
    </Form>
  )
}

const flatMapProperties = labels => Array.from(Object.keys(labels).reduce((propSet, label) => {
  labels[label].forEach(prop => propSet.add(prop))
  return propSet
}, new Set()))