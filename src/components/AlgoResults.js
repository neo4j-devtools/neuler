import React, { Component } from 'react'
import {Button, Header, Icon, Segment, Menu, Loader, Message, Image} from 'semantic-ui-react'
import { connect } from "react-redux"
import GraphVisualiser from './visualisation/GraphVisualiser'
import { getAlgorithmDefinitions } from "./algorithmsLibrary"
import Chart from './visualisation/Chart'
import CodeView from './CodeView'

import { ADDED, completeTask, FAILED, runTask } from "../ducks/tasks"
import html2canvas from "html2canvas";

const tabContentStyle = {
  height: '85vh',
  overflowY: 'auto',
  overflowX: 'hidden'
}

const TableView = ({ task }) => {
  const { ResultView } = getAlgorithmDefinitions(task.group, task.algorithm)
  return <div style={tabContentStyle}>
    <ResultView task={task}/>
  </div>
}

const VisView = ({ task, active }) => (
  <div style={tabContentStyle}>
    <GraphVisualiser taskId={task.taskId} results={task.result} label={task.parameters.label} active={active}
                     algorithm={task.algorithm}
                     relationshipType={task.parameters.relationshipType}
                     writeProperty={(task.parameters.config || {}).writeProperty}/>
  </div>
)

const LoaderExampleInlineCentered = ({ active }) => <Loader active={active} inline='centered'>Fetching Data</Loader>


const ChartView = ({ task }) => {
  if (task.result && task.result.length > 0) {
    return <Chart data={task.result.map(result => ({
      name: result.properties.name || 'Node',
      score: result.score
    }))}/>
  } else {
    return <LoaderExampleInlineCentered active={true}/>
  }
}

class HorizontalAlgoTab extends Component {
  state = {
    activeItem: this.props.error ? 'Error' : 'Table'
  }

  handleMenuItemClick = (e, { name }) => this.setState({ activeItem: name })

  componentDidMount() {
    if (this.props.task.error) {
      this.setState({ activeItem: 'Error' })
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.task.error) {
      this.setState({ activeItem: 'Error' })
    } else if (this.state.activeItem === 'Error') {
      this.setState({ activeItem: 'Table' })
    }
  }

  render() {
    const { task, prevResult, nextResult, currentPage, totalPages } = this.props
    let activeItem = this.state.activeItem

    const activeGroup = task.group
    const getStyle = name => name === activeItem
      ? ({
        display: ''
      })
      : ({
        display: 'none'
      })

    const screenShotStyle = {marginBottom: '-0.6em'}


    return (
      <div>
        {task.completed && task.status === FAILED ? (
            <div>
              <Menu attached='top' tabular>
                <Menu.Item name='Error' active={activeItem === 'Error'}
                           onClick={this.handleMenuItemClick.bind(this)}></Menu.Item>
                <Menu.Item name='Code' active={activeItem === 'Code'}
                           onClick={this.handleMenuItemClick.bind(this)}></Menu.Item>
              </Menu>
              <Segment attached='bottom'>
                <div style={getStyle('Error')}>
                  <Message warning>
                    <Message.Header>Algorithm failed to complete</Message.Header>
                    <p>{task.error}</p>
                  </Message>
                </div>
                <div style={getStyle('Code')}>
                  <CodeView task={task}/>
                </div>
              </Segment>
            </div>
          )
          : <React.Fragment>
            <Menu attached='top' tabular pointing secondary  style={{display: 'flex', justifyContent: 'space-between'}}>
              <div style={{display: 'flex'}}>

                <Menu.Item name='Table' active={activeItem === 'Table'}
                           onClick={this.handleMenuItemClick.bind(this)}></Menu.Item>

                {activeGroup === 'Centralities' ?
                  <Menu.Item name='Chart' active={activeItem === 'Chart'}
                             onClick={this.handleMenuItemClick.bind(this)}></Menu.Item>
                  : null}

                {!(activeGroup === 'Path Finding' || activeGroup === 'Similarity') ?
                  <Menu.Item name='Visualisation' active={activeItem === 'Visualisation'}
                             onClick={this.handleMenuItemClick.bind(this)}></Menu.Item>
                  : null
                }

                <Menu.Item name='Code' active={activeItem === 'Code'}
                           onClick={this.handleMenuItemClick.bind(this)}></Menu.Item>

                <Menu.Item active={activeItem === 'Printscreen'}
                           onClick={() => html2canvas(document.body).then(function(canvas) {
                             const base64ImageData = canvas.toDataURL("image/png")
                             const contentType = 'image/png';

                             const byteCharacters = atob(base64ImageData.substr(`data:${contentType};base64,`.length));
                             const byteArrays = [];

                             for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
                               const slice = byteCharacters.slice(offset, offset + 1024);

                               const byteNumbers = new Array(slice.length);
                               for (let i = 0; i < slice.length; i++) {
                                 byteNumbers[i] = slice.charCodeAt(i);
                               }

                               const byteArray = new Uint8Array(byteNumbers);

                               byteArrays.push(byteArray);
                             }
                             const blob = new Blob(byteArrays, {type: contentType});
                             const blobUrl = URL.createObjectURL(blob);

                             window.open(blobUrl, '_blank');

                           })}>
                  <Image size='mini' style={screenShotStyle} src='/images/Camera2.png' />

                </Menu.Item>
              </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <Button basic icon size='mini' onClick={prevResult} disabled={currentPage === 1}>
                    <Icon name='angle left'/>
                  </Button>
                  <Header as='h3' style={{ margin: '0 1em' }}>
                    {`${task.algorithm} Started at: ${task.startTime.toLocaleTimeString()} - (${currentPage} / ${totalPages})`}
                  </Header>
                  <Button basic icon size='mini' onClick={nextResult} disabled={currentPage === totalPages}>
                    <Icon name='angle right'/>
                  </Button>
                </div>

            </Menu>
            <Segment attached='bottom'>

              <div style={getStyle('Table')}>
                <TableView task={task}/>
              </div>

              <div style={getStyle('Code')}>
                <CodeView task={task}/>
              </div>

              {!(activeGroup === 'Path Finding' || activeGroup === 'Similarity') ?
                <div style={getStyle('Visualisation')}>
                  <VisView task={task} active={activeItem === 'Visualisation'}/>
                </div> : null}

              {activeGroup === 'Centralities' ?
                <div style={getStyle('Chart')}>
                  <ChartView task={task} active={activeItem === 'Chart'}/>
                </div> : null}

            </Segment>
          </React.Fragment>
        }
      </div>
    )
  }
}

class TabExampleVerticalTabular extends Component {
  state = {
    page: 0
  }

  prevResult() {
    this.setState(({ page }) => ({ page: Math.max(0, page - 1) }))
  }

  nextResult() {
    const length = (this.props.tasks || []).length
    this.setState(({ page }) => ({ page: Math.min(length - 1, page + 1) }))
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.tasks.length !== this.props.tasks.length) {
      this.setState({ page: 0 })
      const task = nextProps.tasks[0]
      if (task.status === ADDED) {
        this.onRunAlgo(task)
      }
    }
  }

  onRunAlgo(task) {
    const { taskId, group, algorithm, parameters, persisted } = task
    let algorithmDefinition = getAlgorithmDefinitions(group, algorithm);
    const { service, getFetchQuery } = algorithmDefinition

    let fetchCypher = getFetchQuery(parameters.label)

    let streamQuery = algorithmDefinition.streamQuery
    let storeQuery = algorithmDefinition.storeQuery

    if (group === "Similarity") {
      const { itemLabel, relationshipType, categoryLabel } = parameters
      streamQuery = streamQuery(itemLabel, relationshipType, categoryLabel)
      storeQuery = storeQuery(itemLabel, relationshipType, categoryLabel)
      fetchCypher = getFetchQuery(itemLabel, parameters.config.writeRelationshipType)

      delete parameters.itemLabel
      delete parameters.relationshipType
      delete parameters.categoryLabel
    }

    service({
      streamCypher: streamQuery,
      storeCypher: storeQuery,
      fetchCypher,
      parameters: { ...parameters, limit: this.props.limit },
      persisted
    }).then(result => {
      this.props.completeTask(taskId, result)
      if (persisted) {
        this.props.onComplete()
      }
    }).catch(exc => {
      console.log('ERROR IN SERVICE', exc)
      this.props.completeTask(taskId, [], exc.toString())

    })

    this.props.runTask(taskId, persisted ? [storeQuery, fetchCypher] : [streamQuery])
  }

  render() {
    const tasks = this.props.tasks
    const page = this.state.page
    if (tasks && tasks.length > 0) {
      const currentTask = tasks[this.state.page]
      return <HorizontalAlgoTab
        task={currentTask}
        prevResult={this.prevResult.bind(this)}
        nextResult={this.nextResult.bind(this)}
        currentPage={page + 1}
        totalPages={tasks.length}
      />
    } else {
      return null
    }
  }
}

const mapStateToProps = state => ({
  tasks: state.tasks,
  limit: state.settings.limit
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  runTask: (taskId, query) => {
    dispatch(runTask({ taskId, query }))
  },
  completeTask: (taskId, result, error) => {
    dispatch(completeTask({ taskId, result, error }))
  },
  onComplete: () => {
    ownProps.onComplete()
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(TabExampleVerticalTabular)
