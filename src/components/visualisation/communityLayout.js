export const layoutDr = nodes => {
  nodes.forEach(node => {
    const max = 300
    const min = 0
    node.x = Math.random() * (max - min) + min
    node.y = Math.random() * (max - min) + min
  })
}