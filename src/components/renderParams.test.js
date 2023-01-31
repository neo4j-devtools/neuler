import RenderParams from './renderParams';
import { render } from 'react-testing-library'
import React from 'react'

describe("Parameter renderer should", () => {

  it('renders empty with nothing provided', () => {
    const { container } = render(<RenderParams parameters={{}}/>)
    expect(container.getElementsByTagName('div')).toHaveLength(0)
    expect(container.getElementsByTagName('pre')).toHaveLength(0)
  })

  it('renders with a simple object', () => {
    const { container, getByText } = render(<RenderParams parameters={{ prop: 'value' }}/>)
    expect(container.getElementsByTagName('pre')).toHaveLength(1)
    expect(getByText(/^:param.*prop.*value.*$/)).toBeTruthy()
  })

  it('renders with a complex object', () => {
    const { container, getByText } = render(<RenderParams parameters={{
      prop: 'value',
      secondProp: 123,
      thirdProp: [1, 2, 3]
    }}/>)
    expect(container.getElementsByTagName('pre')).toHaveLength(3)
    expect(getByText(/^:param.*prop.*value.*$/)).toBeTruthy()
    expect(getByText(/^:param.*secondProp.*123.*$/)).toBeTruthy()
    expect(getByText(/^:param.*thirdProp.*\[.*1, 2, 3.*\].*$/)).toBeTruthy()
  })
})
