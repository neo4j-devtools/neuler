import {
  Button,
  Card,
  CardGroup,
  Checkbox,
  Container,
  Divider,
  Dropdown,
  Form,
  Header,
  Icon,
  TextArea
} from "semantic-ui-react"
import React, {Component, useState} from 'react'

import { selectGroup } from "../ducks/algorithms"
import {connect} from "react-redux";
import {setActiveDatabase, setDatabases, setLabels, setPropertyKeys, setRelationshipTypes} from "../ducks/metadata";
import {getDriver, hasNamedDatabase, onActiveDatabase} from "../services/stores/neoStore";
import {loadDatabases, loadMetadata} from "../services/metadata";

class Home extends Component {

    constructor(props) {
        super(props)
        this.state = {
            serverInfo: ""
        }
    }

    onRefresh() {
        loadMetadata(this.props.metadata.versions.neo4jVersion).then(metadata => {
            this.props.setLabels(metadata.labels)
            this.props.setRelationshipTypes(metadata.relationships)
            this.props.setPropertyKeys(metadata.propertyKeys)
            this.props.setDatabases(metadata.databases)
        })
    }

    render() {
        const containerStyle = {
            padding: '1em'
        }

        const {selectGroup, setActiveDatabase, metadata} = this.props

        const databaseOptions= metadata.databases.map(value => {
            return {key: value.name, value: value.name, text: (value.name) + (value.default ? " (default)" : "")};
        })

        getDriver().verifyConnectivity().then(value => this.setState({serverInfo: value}))

        return (<div style={containerStyle}>
                <Container fluid>
                    <Header as={"h3"}>
                        Use Database
                    </Header>

                    <div>
                        <p>
                            Connected to: {this.state.serverInfo.address}

                        </p>

                            <Button as='div' labelPosition='left'>
                            <Dropdown value={metadata.activeDatabase} placeholder='Database' fluid search selection style={{"width": "290px"}}
                                      options={databaseOptions} onChange={(evt, data) => {
                                setActiveDatabase(data.value);
                                onActiveDatabase(data.value);
                                this.onRefresh()
                            }}/>

                              {hasNamedDatabase() ? <Button icon style={{marginLeft: "10px"}} onClick={this.onRefresh.bind(this)}>
                                <Icon className="refresh" size="large"  />
                            </Button> : null}
                            </Button>



                    </div>

                    <Divider />

                    <Header as={"h3"}>
                        Algorithm Categories
                    </Header>
                    <p>
                        The Neo4j Graph Data Science Library supports the following categories of algorithms.
                    </p>

                    <CardGroup>
                        <Card key={"centralities"}>
                            <Card.Content>
                                <Icon name='sitemap'/>
                                <Card.Header>
                                    Centralities
                                </Card.Header>
                                <Card.Meta>
                                    These algorithms determine the importance of distinct nodes in a network
                                </Card.Meta>
                            </Card.Content>
                            <Card.Content extra>
                                <div className='ui two buttons'>
                                    <Button basic color='green' onClick={() => selectGroup('Centralities')}>
                                        Select
                                    </Button>
                                </div>
                            </Card.Content>
                        </Card>

                        <Card key={"communityDetection"}>
                            <Card.Content>
                                <Icon name='sitemap'/>
                                <Card.Header>
                                    Community Detection
                                </Card.Header>
                                <Card.Meta>
                                    These algorithms evaluate how a group is clustered or partitioned, as
                                    well as its tendency to strengthen or break apart
                                </Card.Meta>
                            </Card.Content>
                            <Card.Content extra>
                                <div className='ui two buttons'>
                                    <Button basic color='green' onClick={() => selectGroup('Community Detection')}>
                                        Select
                                    </Button>
                                </div>
                            </Card.Content>
                        </Card>

                        <Card key={"pathFinding"}>
                            <Card.Content>
                                <Icon name='sitemap'/>
                                <Card.Header>
                                    Path Finding
                                </Card.Header>
                                <Card.Meta>
                                    These algorithms help find the shortest path or evaluate the availability and quality of routes
                                </Card.Meta>
                            </Card.Content>
                            <Card.Content extra>
                                <div className='ui two buttons'>
                                    <Button basic color='green' onClick={() => selectGroup("Path Finding")}>
                                        Select
                                    </Button>
                                </div>
                            </Card.Content>
                        </Card>

                        <Card key={"similarity"}>
                            <Card.Content>
                                <Icon name='sitemap'/>
                                <Card.Header>
                                    Similarity
                                </Card.Header>
                                <Card.Meta>
                                    These algorithms help calculate the similarity of nodes.
                                </Card.Meta>
                            </Card.Content>
                            <Card.Content extra>
                                <div className='ui two buttons'>
                                    <Button basic color='green' onClick={() => selectGroup("Similarity")}>
                                        Select
                                    </Button>
                                </div>
                            </Card.Content>
                        </Card>

                    </CardGroup>


                </Container>
                <FeedbackForm />

          </div>

        )

    }
}

const headerStyle = {
  padding: "18px 24px",
  fontSize: "16px",
  margin: "0px",
  borderTopLeftRadius: "5px",
  borderTopRightRadius: "5px",
  fontWeight: "normal",
  borderBottom: "1px solid rgba(210, 213, 218, 0.5)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  cursor: "pointer",
  background: "rgb(109, 204, 156)",
  color: "white"
};

const FeedbackFirstScreen = (props) => {
  const outerStyle = {padding: "24px"}
  const innerStyle = {marginBottom: "10px"}

  if (!props.open) {
    innerStyle.display = "none"
    outerStyle.display = "none"
  }

  return <React.Fragment>
    <h4 style={headerStyle}>Help us improve NEuler <Icon className="angle down large" onClick={() => props.setOpen(!props.open)}/></h4>
    <div style={outerStyle}>
      <form>
        <div style={innerStyle}><p>Were you able to do what you wanted?</p>

          <div>
            <Icon className="thumbs up big green feedback-icon" style={{marginRight: "5px", fontSize: "2.5em"}} onClick={() => props.response(true)}/>
            <Icon className="thumbs down big red feedback-icon" style={{fontSize: "2.5em"}} onClick={() => props.response(false)} />
          </div>

        </div>

      </form>
    </div>
  </React.Fragment>
}

const FeedbackSecondScreen = (props) => {
  const outerStyle = {padding: "24px"}
  const innerStyle = {marginBottom: "10px"}

  if (!props.open) {
    innerStyle.display = "none"
    outerStyle.display = "none"
  }

  let [reason, setReason] = useState("results")
  let [moreInformation, setMoreInformation] = useState("")

  return <React.Fragment>
    <h4 style={headerStyle}>Help us improve NEuler <Icon className="angle down large" onClick={() => props.setOpen(!props.open)}/></h4>
    <div style={outerStyle}>
      <form>
        <div style={innerStyle}>
          <p>Thanks for your feedback. How can we improve?</p>
          <Form style={{marginBottom: "10px"}}>

            <Form.Field>
              <Checkbox
                radio
                label="Results are confusing or don't make sense"
                name='checkboxRadioGroup'
                value='results'
                checked={reason === 'results'}
                onChange={() => setReason("results")}
              />
            </Form.Field>
            <Form.Field>
              <Checkbox
                radio
                label="Missing algorithm or functionality"
                name='checkboxRadioGroup'
                value='missing'
                checked={reason === 'missing'}
                onChange={() => setReason("missing")}
              />
            </Form.Field>
            <Form.Field>
              <Checkbox
                radio
                label="The app is confusing/I don't know what to do"
                name='checkboxRadioGroup'
                value='hard-to-follow'
                checked={reason === 'hard-to-follow'}
                onChange={() => setReason("hard-to-follow")}
              />
            </Form.Field>
            <Form.Field>
              <Checkbox
                radio
                label='It has another problem not covered by the above'
                name='checkboxRadioGroup'
                value='other'
                checked={reason === 'other'}
                onChange={() => setReason("other")}
              />
            </Form.Field>

            <TextArea placeholder='Tell us more' onChange={(event, data) => setMoreInformation(data.value)} />
          </Form>

          <Button onClick={(e) => {props.submit(reason, moreInformation); e.preventDefault()}}>Submit</Button>
          <Button onClick={(e) => {props.skip(); e.preventDefault()}}>Skip</Button>

        </div>

      </form>
    </div>
  </React.Fragment>
}


const FeedbackThanks = (props) => {
  const outerStyle = {padding: "24px"}
  const innerStyle = {}

  if (!props.open) {
    innerStyle.display = "none"
    outerStyle.display = "none"
  }

  return <React.Fragment>
    <h4 style={headerStyle}>Help us improve NEuler
      <Icon className="angle down large" onClick={() => props.setOpen(!props.open)}/>
    </h4>
    <div style={outerStyle}>
      <div style={innerStyle}>
        <p>{props.message}</p>
      </div>

    </div>
  </React.Fragment>
}


const FeedbackForm = () => {
  const [open, setOpen] = useState(true);
  const [feedback, setFeedback] = useState({complete: false})

  let View

  if(feedback.complete) {
    const message = feedback.success ? "Thanks for your feedback. We're happy to hear that NEuler is serving you well!" : "Thanks for your feedback. We'll take it account when we're updating NEuler."
    View = <FeedbackThanks open={open} setOpen={setOpen} message={message} />
  } else {
    if(feedback.success === undefined) {
      View = <FeedbackFirstScreen open={open} setOpen={setOpen} response={(wasSuccessful) => {
        feedback.success = wasSuccessful
        if(wasSuccessful) {
          feedback.complete = true
        }
        setFeedback(feedback)
      }}/>
    } else {
      View = <FeedbackSecondScreen open={open} setOpen={setOpen}
                                   skip={() => {
                                     console.log("skip")
                                     feedback.complete = true
                                     feedback.success= false
                                     setFeedback(feedback)
                                   }}
                                   submit={(reason, moreInformation) => {
                                     feedback.complete = true
                                     feedback.success= false
                                     feedback.reason = reason
                                     feedback.moreInformation = moreInformation
                                     console.log("feedback", feedback)
                                     setFeedback(feedback)
                                   }} />
    }

  }

  return <div id="search-feedback-module"
              style={{
                boxShadow: "rgba(0, 0, 0, 0.17) 0px 2px 10px",
                width: "300px",
                background: "rgb(249, 251, 253)",
                position: "fixed",
                bottom: "12px",
                right: "12px",
                borderRadius: "5px",
                opacity: "1"
              }}>
    {View}
  </div>
}

const mapStateToProps = state => ({
    activeGroup: state.algorithms.group,
    metadata: state.metadata
})

const mapDispatchToProps = dispatch => ({
    selectGroup: group => dispatch(selectGroup(group)),
    setActiveDatabase: database => dispatch(setActiveDatabase(database)),
    setDatabases: databases => dispatch(setDatabases(databases)),
    setLabels: labels => dispatch(setLabels(labels)),
    setRelationshipTypes: relationshipTypes => dispatch(setRelationshipTypes(relationshipTypes)),
    setPropertyKeys: propertyKeys => dispatch(setPropertyKeys(propertyKeys))
})

export default connect(mapStateToProps, mapDispatchToProps)(Home)
