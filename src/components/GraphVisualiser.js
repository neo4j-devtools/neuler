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
          caption: "name"
        },
        "Movie": {
          caption: 'title'
        }
      },
      relationships: {
        "ACTED_IN": {
          "caption": false
        }
      },
      initial_cypher: "MATCH (n)-[r:ACTED_IN]->(m) RETURN n,r,m"
    }
  }

  componentDidMount() {
    const viz = new window.NeoVis.default(this.config);
    viz.render();
  }

  /*setVisContainer (visContainer) {
    console.log(visContainer)
    this.visContainer = visContainer
  }
*/
  render() {
    return <div id='viz' style={{width: '1100px', height: '500px'}} ref={this.visContainer} />
  }
}