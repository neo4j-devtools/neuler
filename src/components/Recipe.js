import {connect} from "react-redux";
import {selectAlgorithm} from "../ducks/algorithms";
import React from "react";
import {getAlgorithmDefinitions, getGroup} from "./algorithmsLibrary";
import {v4 as generateTaskId} from "uuid";
import {ADDED, COMPLETED, FAILED, RUNNING} from "../ducks/tasks";
import {getActiveDatabase} from "../services/stores/neoStore";
import {Button, Card, CardGroup, Container, Icon, Menu} from "semantic-ui-react";
import {SuccessTopBar} from "./Results/SuccessTopBar";
import {TableView} from "./Results/TableView";
import CodeView from "./CodeView";
import {ChartView} from "./Results/ChartView";
import {communityNodeLimit, limit} from "../ducks/settings";
import {AlgoFormView} from "./AlgorithmForm";
import {VisView} from "./Results/VisView";

import {Route, Switch, useHistory, useParams, useLocation, useRouteMatch} from "react-router-dom";
import {onRunAlgo} from "../services/tasks";

const containerStyle = {
    padding: '1em'
}



const recipes = {
    "directed-graph-influencers": {
        name: "Directed Graph Influencers",
        shortDescription: "This recipe contains algorithms that find the most influential nodes in a directed graph.",
        slides: [
            {
                group: "Centralities",
                algorithm: "Degree",
                title: "Degree Centrality",
                description: <React.Fragment>
                    <p>
                        Degree Centrality finds the most influential or central nodes in a graph based on the
                        number of relationships that the node has.
                    </p>
                    <p>
                        By default, it counts the number of incoming relationships but this value can be
                        configured via the <i>Relationship Orientation</i> parameter.
                    </p>
                    <p>
                        The weighted degree centrality for each node is computed by providing an optional
                        relationship property name via the <i>Weight Property</i> parameter.
                    </p>
                </React.Fragment>
            },
            {
                group: "Centralities",
                algorithm: "Page Rank",
                title: "Page Rank",
                description: <React.Fragment>
                    <p>
                        Page Rank finds the nodes that have the great transitive influence.
                    </p>
                    <p>
                        This means that it's not only how many incoming relationships that matters, it's also the importance of the nodes on the other side of that relationship.
                    </p>
                </React.Fragment>
            }
        ]
    }
}


const RecipeView = (props) => {
    let { path, url } = useRouteMatch();

    return <Switch>
        <Route exact path={path}>
            <React.Fragment>
                <div className="page-heading">
                    Algorithm Recipes
                </div>

            <div style={containerStyle}>
                <p>
                    Algorithm Recipes are collections or series of algorithms that provide provide useful insights on
                    certain types of graphs or can be combined to solve data science problems.
                </p>
                <Recipes recipes={recipes}/>


            </div>
            </React.Fragment>
        </Route>
        <Route path={`${path}/:recipeId`}>
            <IndividualRecipe
                metadata={props.metadata}
                limit={props.limit}
                gdsVersion={props.metadata.versions.gdsVersion}
            />
        </Route>
    </Switch>
}

const IndividualRecipe = (props) => {
    const panelRef = React.createRef()
    const [activeItem, setActiveItem] = React.useState("Configure")
    const [activeResultsItem, setActiveResultsItem] = React.useState("Table")
    const [selectedSlide, setSelectedSlide] = React.useState(0)

    const getStyle = name => name === activeItem ? {display: ''} : {display: 'none'}
    const getStyleResultsTab = name => name === activeItem ? {display: 'flex'} : {display: 'none'}
    const getResultsStyle = name => name === activeResultsItem ? {display: ''} : {display: 'none'}

    const history = useHistory();
    const [localRecipes, setLocalRecipes] = React.useState(recipes)

    const addLimits = (params) => {
        return {
            ...params,
            limit: props.limit,
            communityNodeLimit: props.communityNodeLimit
        }
    }

    const {recipeId} = useParams();

    if (!localRecipes[recipeId].slides[selectedSlide].task) {
        setLocalRecipes(localRecipes => {
            const newLocalRecipes = Object.assign({}, localRecipes)
            newLocalRecipes[recipeId].slides[selectedSlide].task = {
                group: group,
                algorithm: algorithm,
                status: ADDED,
                taskId,
                parameters: params,
                formParameters,
                persisted: false,
                startTime: new Date(),
                database: getActiveDatabase()
            }
            return newLocalRecipes
        })
    }

    React.useEffect(() => {
        if (!localRecipes[recipeId].slides[selectedSlide].task) {
            setLocalRecipes(localRecipes => {
                const newLocalRecipes = Object.assign({}, localRecipes)
                newLocalRecipes[recipeId].slides[selectedSlide].task = {
                    group: group,
                    algorithm: algorithm,
                    status: ADDED,
                    taskId,
                    parameters: params,
                    formParameters,
                    persisted: false,
                    startTime: new Date(),
                    database: getActiveDatabase()
                }
                return newLocalRecipes
            })
        }
    }, [selectedSlide])

    const selectedRecipe = localRecipes[recipeId]
    const maxSlide = selectedRecipe.slides.length
    const group = selectedRecipe.slides[selectedSlide].group
    const algorithm = selectedRecipe.slides[selectedSlide].algorithm

    const {parameters, parametersBuilder} = getAlgorithmDefinitions(group, algorithm, props.metadata.versions.gdsVersion)

    const params = parametersBuilder({
        ...parameters,
        requiredProperties: Object.keys(parameters)
    })

    const formParameters = addLimits(parameters);
    const taskId = generateTaskId()

    const handleResultsMenuItemClick = (e, {name}) => {
        setActiveResultsItem(name)
    }

    const selectedTask = selectedRecipe.slides[selectedSlide].task
    const activeGroup = selectedTask && selectedTask.group

    console.log("task", selectedTask, "selectedSlide", selectedSlide, "localRecipes", localRecipes)

    const updateSelectedTask = (updates) => {
        setLocalRecipes(localRecipes => {
            const newLocalRecipes = Object.assign({}, localRecipes)
            const existingTask = newLocalRecipes[recipeId].slides[selectedSlide].task
            newLocalRecipes[recipeId].slides[selectedSlide].task = {...existingTask, ...updates}
            return newLocalRecipes
        })
    }

    return selectedTask && <React.Fragment>
        <nav className="top-nav">
            <Button onClick={() => {

                history.push("/recipes/")
            }} icon="left arrow" labelPosition="left" content="All algorithm recipes" className="back-to-algorithms"/>
        </nav>
        <div className="page-heading">
            {selectedRecipe.name}
        </div>
        <div style={containerStyle}>
            <Container fluid>
                <p>{selectedRecipe.shortDescription}</p>
                <div className="recipes">
                    <div className="recipe">
                        <div className="left">
                          <span className="recipe-heading">
                              {selectedRecipe.slides[selectedSlide].title}
                          </span>
                            {selectedRecipe.slides[selectedSlide].description}
                        </div>
                        <div className="right">
                            <SuccessTopBar task={selectedTask} panelRef={props.panelRef} activeItem={activeItem}
                                           activeGroup="Configure"
                                           handleMenuItemClick={(e, {name}) => setActiveItem(name)}
                            />
                            <div ref={panelRef}>
                                <div style={getStyle("Configure")}>
                                    <AlgoForm
                                        selectedAlgorithmReadOnly={true}
                                        task={selectedTask}
                                        limit={props.limit}
                                        onRun={(newParameters, formParameters, persisted) => {
                                            onRunAlgo(selectedTask, newParameters, formParameters, persisted, props.metadata.versions,
                                                (taskId, result, error) => {
                                                    if (error) {
                                                        updateSelectedTask({status: FAILED, result, completed: true})
                                                    } else {
                                                        updateSelectedTask({status: COMPLETED, result, completed: true})
                                                    }
                                                },
                                                () => {
                                                },
                                                (taskId, query, namedGraphQueries, parameters, formParameters, persisted) => {
                                                    updateSelectedTask({
                                                        status: RUNNING,
                                                        query,
                                                        namedGraphQueries,
                                                        parameters,
                                                        formParameters,
                                                        persisted,
                                                        result: null
                                                    })
                                                })
                                        }}
                                        onCopy={(group, algorithm, newParameters, formParameters) => {}}
                                    />
                                </div>

                                <div style={getStyleResultsTab("Results")}>
                                    <div>
                                        <Menu pointing secondary vertical className="resultsMenu">
                                            <Menu.Item
                                                name='Table'
                                                active={activeResultsItem === 'Table'}
                                                onClick={handleResultsMenuItemClick}
                                            />

                                            {getGroup(selectedTask.algorithm) === "Centralities" &&
                                            <Menu.Item
                                                name='Chart'
                                                active={activeResultsItem === 'Chart'}
                                                onClick={handleResultsMenuItemClick}
                                            />}

                                            {!(getGroup(selectedTask.algorithm) === 'Path Finding' || getGroup(selectedTask.algorithm) === 'Similarity') &&
                                            <Menu.Item
                                                name='Visualisation'
                                                active={activeResultsItem === 'Visualisation'}
                                                onClick={handleResultsMenuItemClick}
                                            />}

                                        </Menu>
                                    </div>
                                    <div style={{flexGrow: "1", paddingLeft: "10px"}}>
                                        {!(activeGroup === 'Path Finding' || activeGroup === 'Similarity') ?
                                            <div style={getResultsStyle('Visualisation')}>
                                                <VisView task={selectedTask} active={activeResultsItem === 'Visualisation'}/>
                                            </div> : null}

                                        {activeGroup === 'Centralities' ?
                                            <div style={getResultsStyle('Chart')}>
                                                <ChartView task={selectedTask} active={activeResultsItem === 'Chart'}/>
                                            </div> : null}

                                        <div style={getResultsStyle('Table')}>
                                            <TableView task={selectedTask} gdsVersion={props.gdsVersion}/>
                                        </div>
                                    </div>

                                </div>

                                <div style={getStyle('Code')}>
                                    <CodeView task={selectedTask}/>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                <div className="recipe-navigation">
                    {selectedSlide <= 0 && <Icon size="large" disabled={true} className="angle left disabled"/>}
                    {selectedSlide > 0 && <Icon size="large" onClick={() => setSelectedSlide(selectedSlide-1)} className="angle left"/>}
                    <span>Browse Algorithms</span>
                    {selectedSlide < (maxSlide-1) && <Icon size="large" className="angle right" onClick={() => setSelectedSlide(selectedSlide+1)}/>}
                    {!(selectedSlide < (maxSlide-1)) && <Icon size="large" className="angle right disabled" disabled={true}/>}

                </div>
            </Container></div>
    </React.Fragment>
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
