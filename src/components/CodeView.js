import React, {Component} from 'react'
import {Button, Message, Segment} from "semantic-ui-react"
import {RenderParams} from "./renderParams"
import {v4 as generateId} from 'uuid'

const generateGuidesUrl = 'https://3uvkamww2b.execute-api.us-east-1.amazonaws.com/dev/generateBrowserGuide'


const stringfyParam = value => {
  if (!value) {
    return 'null'
  }

  if (typeof value === 'object') {
    return '{' + Object.keys(value).map(key => `${key}: ${JSON.stringify(value[key])}`).join(', ') + '}'
  } else {
    return JSON.stringify(value)
  }
}

export default class extends Component {
  state = {
    browserGuide: {}
  }

  constructPayload(parameters, query, guid) {
    return {
      uuid: guid,
      params: Object.keys(parameters).map(key => `:param ${key} => (${stringfyParam(parameters[key])});`).join('\n'),
      query: query
    }
  }


  generateGuide(parameters, query, taskId) {
    const guid = generateId()

    const payload = this.constructPayload(parameters, query, guid)

    return fetch(generateGuidesUrl, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload)
    })
      .then(response => {
        this.setState({browserGuide: {...this.state.browserGuide, [taskId]: `:play neuler/user-content-${guid}.html`}})
        return guid
      })
      .catch(err => {
        console.log('GENERATE GUIDE CALL ERROR', err)
        throw (err)
      })
  }

  openBrowser(task) {
    const {parameters, query, taskId} = task
    this.generateGuide(parameters, query, taskId)
      .then(guideId => {
        window.open(`neo4j://graphapps/neo4j-browser?cmd=play&arg=neuler/user-content-${guideId}.html`, '_self')
      })
  }

  // componentWillReceiveProps(nextProps, nextContext) {
  //     if (this.props.task !== nextProps.task) {
  //         this.setState({browserGuide: null})
  //     }
  // }

  render() {
    const {task} = this.props
    const {browserGuide} = this.state

    const taskGuide = browserGuide[task.taskId]

    return (
      <div style={{
        height: '85vh',
        overflowY: 'auto',
        overflowX: 'hidden'
      }}>
        <p>This algorithm run can be reproduced in the Neo4j Browser, by defining the following parameters:</p>
        {
          task.parameters
            ? <Segment>
              <RenderParams parameters={task.parameters}/>
            </Segment>
            : null
        }


        {task.query ?


          <div>
            <p>And by running the following {task.query.length > 1 ? 'queries' : 'query'}:</p>

            {
              task.query.map(query => {
                return <Segment>
                  <pre>{query && query.replace('\n  ', '\n')}</pre>
                </Segment>
              })
            }

            {/*<p>We can also generate a Neo4j Browser guide containing all of the above:</p>*/}


            {/*<Segment>*/}
              {/*<Button basic color='green' icon='play' content='Send to Neo4j Browser'*/}
                      {/*onClick={() => this.openBrowser.bind(this)(task)}/>*/}
              {/*{taskGuide ? <Message>*/}
                {/*<p>*/}
                  {/*If the Neo4j Browser doesn't automatically open, you can copy/paste the following command*/}
                  {/*into the Neo4j Browser:*/}
                {/*</p>*/}
                {/*<pre>{taskGuide}</pre>*/}
              {/*</Message> : null}*/}
            {/*</Segment>*/}
          </div>
          : null
        }
      </div>
    )
  }

}
