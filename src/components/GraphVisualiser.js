import React, {Component} from 'react'

export default class extends Component {
  constructor(props) {
    super(props)
    this.visContainer = React.createRef()

    this.config = {
      container_id: "viz",
      server_url: "bolt://localhost:7687",
      server_user: "neo4j",
      server_password: "a",
      labels: {
        "Person": {
          caption: "name",
          size: "pagerank"
        },
        "Movie": {
          caption: 'title'
        }
      },
      initial_cypher: `match (n:Person)
where exists(n.pagerank)
return { labels: labels(n), properties: { identity: ID(n), name: n.name, pagerank: n.pagerank } } as path
`
    }
  }

  componentDidMount() {
    const viz = new window.NeoVis.default(this.config);
    viz.render();
  }

  render() {
    return <div id='viz' style={{width: '1100px', height: '500px'}} ref={this.visContainer} />
  }
}