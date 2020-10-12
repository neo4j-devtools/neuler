import {connect} from "react-redux";
import {selectAlgorithm} from "../ducks/algorithms";
import React from "react";
import {getAlgorithmDefinitions} from "./algorithmsLibrary";
import {v4 as generateTaskId} from "uuid";
import {ADDED} from "../ducks/tasks";
import {getActiveDatabase} from "../services/stores/neoStore";
import {Button, Card, CardGroup, Container, Icon} from "semantic-ui-react";
import {OpenCloseSection} from "./Form/OpenCloseSection";
import {SuccessTopBar} from "./Results/SuccessTopBar";
import {TableView} from "./Results/TableView";
import CodeView from "./CodeView";
import {ChartView} from "./Results/ChartView";
import {communityNodeLimit, limit} from "../ducks/settings";
import {AlgoFormView} from "./AlgorithmForm";
import {VisView} from "./Results/VisView";

import {Route, Switch, useHistory, useParams, useRouteMatch} from "react-router-dom";

const containerStyle = {
    padding: '1em'
}



const recipes = {
    "directed-graph-influencers": {
        name: "Directed Graph Influencers",
        shortDescription: "This recipe contains algorithms that find the most influential nodes in a directed graph."
    }
}


const RecipeView = (props) => {
    let { path, url } = useRouteMatch();

    const panelRef = React.createRef()
    const [activeItem, setActiveItem] = React.useState("Configure")

    const getStyle = name => name === activeItem ? {display: ''} : {display: 'none'}


    return <Switch>
        <Route exact path={path}>
            <div style={containerStyle}><Container fluid>
                <OpenCloseSection title="Algorithm Recipes">
                    <p>
                        Algorithm Recipes are collections or series of algorithms that provide provide useful insights on
                        certain types of graphs or can be combined to solve data science problems.
                    </p>
                    <Recipes recipes={recipes}/>

                </OpenCloseSection>
            </Container>
            </div>
        </Route>
        <Route path={`${path}/:recipeId`}>
            <IndividualRecipe metadata={props.metadata} panelRef={panelRef} activeItem={activeItem} setActiveItem={setActiveItem} getStyle={getStyle} />
        </Route>
    </Switch>
}

const IndividualRecipe  = (props) => {
    const { recipeId } = useParams();

    const {getStyle} = props

    const addLimits = (params) => {
        return {
            ...params,
            limit: props.limit,
            communityNodeLimit: props.communityNodeLimit
        }
    }

    const { parameters, parametersBuilder } = getAlgorithmDefinitions("Centralities", "Degree", props.metadata.versions.gdsVersion)

    const params = parametersBuilder({
        ...parameters,
        requiredProperties: Object.keys(parameters)
    })


    const formParameters = addLimits(parameters);
    const taskId = generateTaskId()
    const task = {
        group : "Centralities",
        algorithm: "Degree",
        status: ADDED,
        taskId,
        parameters: params,
        formParameters,
        persisted: false,
        startTime: new Date(),
        database: getActiveDatabase()
    }


  return <div style={containerStyle}><Container fluid>
      <OpenCloseSection title={recipes[recipeId].name}>
          <p>{recipes[recipeId].shortDescription}</p>
          <div className="recipe">
              <div className="left">
                  Some explanatory text
              </div>
              <div className="right">
                  <SuccessTopBar task={task} panelRef={props.panelRef} activeItem={props.activeItem} activeGroup="Configure"
                                 handleMenuItemClick={(e, { name }) => props.setActiveItem(name)}
                  />
                  <div ref={props.panelRef}>
                      <div style={getStyle("Configure")}>
                          <AlgoForm
                              task={task}
                              limit={props.limit}
                              onRun={(newParameters, formParameters, persisted) => {
                                  console.log("run algorithm")
                              }}
                              onCopy={(group, algorithm, newParameters, formParameters) => {
                                  console.log("copy algorithm")
                              }}
                          />
                      </div>

                      <div style={getStyle('Table')}>
                          <TableView task={task} gdsVersion={props.metadata.versions.gdsVersion}/>
                      </div>

                      <div style={getStyle('Code')}>
                          <CodeView task={task}/>
                      </div>

                      {!(task.group === 'Path Finding' || task.group === 'Similarity') ?
                          <div style={getStyle('Visualisation')}>
                              <VisView task={task} active={props.activeItem === 'Visualisation'}/>
                          </div> : null}

                      {task.group === 'Centralities' ?
                          <div style={getStyle('Chart')}>
                              <ChartView task={task} active={props.activeItem === 'Chart'}/>
                          </div> : null}
                  </div>
              </div>
          </div>
      </OpenCloseSection>
  </Container></div>
}

const Recipes = (props) => {
    const history = useHistory();

    const {recipes} = props
    return  <CardGroup>
        {Object.keys(recipes).map(key => {
            return <Card key={key}>
                <Card.Content>
                    <Icon name='sitemap'/>
                    <Card.Header>
                        {recipes[key].name}
                    </Card.Header>
                    <Card.Meta>
                        {recipes[key].shortDescription}
                    </Card.Meta>
                </Card.Content>
                <Card.Content extra>
                    <div className='ui two buttons'>
                        <Button basic color='green'  onClick={() => history.push('/recipes/' + key)}>
                            Select
                        </Button>
                    </div>
                </Card.Content>
            </Card>
        })}
    </CardGroup>
}


const AlgoForm = connect(state => ({
    activeGroup: "Centralities",
    activeAlgorithm: "Degree",
    currentAlgorithm: getAlgorithmDefinitions("Centralities", "Degree", state.metadata.versions.gdsVersion),
    metadata: state.metadata,
    limit: state.settings.limit,
    communityNodeLimit: state.settings.communityNodeLimit,
}), dispatch => ({
    updateLimit: value => dispatch(limit(value)),
    updateCommunityNodeLimit: value => dispatch(communityNodeLimit(value)),
}))(AlgoFormView)



export const Recipe = connect(state => ({
    metadata: state.metadata,
    activeAlgorithm: state.algorithms.algorithm,
    limit: state.settings.limit,
}), dispatch => ({
    selectAlgorithm: group => dispatch(selectAlgorithm(group)),
}))(RecipeView)
