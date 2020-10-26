import {connect} from "react-redux";
import {selectAlgorithm} from "../ducks/algorithms";
import React from "react";
import {getAlgorithmDefinitions, getGroup} from "./algorithmsLibrary";
import {v4 as generateTaskId} from "uuid";
import {ADDED, COMPLETED, FAILED, removeTask, RUNNING} from "../ducks/tasks";
import {getActiveDatabase} from "../services/stores/neoStore";
import {Button, Card, CardGroup, Container, Icon, Menu} from "semantic-ui-react";
import {SuccessTopBar} from "./Results/SuccessTopBar";
import {TableView} from "./Results/TableView";
import CodeView from "./CodeView";
import {ChartView} from "./Results/ChartView";
import {addDatabase, communityNodeLimit, initLabel, limit} from "../ducks/settings";
import {AlgoFormView} from "./AlgorithmForm";
import {VisView} from "./Results/VisView";

import {Route, Switch, useHistory, useParams, useRouteMatch} from "react-router-dom";
import {onRunAlgo} from "../services/tasks";
import {refreshMetadata} from "./Startup/startup";
import {
    setDatabases,
    setLabels,
    setNodePropertyKeys,
    setPropertyKeys,
    setRelationshipTypes,
    setVersions
} from "../ducks/metadata";

const containerStyle = {
    padding: '1em'
}

const recipes = {
    "directed-graph-influencers": {
        name: "Directed Graph Influencers",
        shortDescription: "This recipe contains algorithms that find the most influential nodes in a directed graph.",
        completionMessage: "You should now have a good idea about how to find the most influential or central nodes in your graph.",
        slides: [
            {
                group: "Centralities",
                algorithm: "Degree",
                title: "Degree Centrality",
                overrides: { formParameters: {} },
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
                overrides: { formParameters: {} },
                description: <React.Fragment>
                    <p>
                        Page Rank finds the nodes that have the great transitive influence.
                    </p>
                    <p>
                        This means that it's not only how many incoming relationships that matters, it's also the importance of the nodes on the other side of that relationship.
                    </p>
                </React.Fragment>
            },
            {
                group: "Centralities",
                algorithm: "Betweenness",
                title: "Betweenness Centrality",
                overrides: { formParameters: {} },
                description: <React.Fragment>
                    <p>
                        The Betweenness Centrality algorithm detects the amount of influence a node has over the flow of information in a graph.
                    </p>
                    <p>
                        It is often used to find nodes that serve as a bridge from one part of a graph to another.
                    </p>
                    <p>
                        We can use this algorithm to find nodes that are well connected to a sub graph within the larger graph.
                    </p>
                </React.Fragment>
            }
        ]
    },
    "community-detection": {
        name: "Community Detection on Multi Partite Graph",
        shortDescription: "This recipe contains a sequence of algorithms for detecting communities in a multi partite (more than 1 label) graph.",
        completionMessage: "You should now understand how to find communities in a graph containing multiple labels",
        slides: [
            {
                group: "Similarity",
                algorithm: "Jaccard",
                title: "Jaccard Similarity",
                overrides: {
                    formParameters: {persist: true},
                    parameters: {config: {}},
                    formParametersToPassOn: [{source: "writeRelationshipType", target: "relationshipType"}],
                    slidesToUpdate: [1]
                },
                description: <React.Fragment>
                    <p>Node similarity blah blah</p>
                </React.Fragment>
            },
            {
                group: "Community Detection",
                algorithm: "Label Propagation",
                title: "Label Propagation",
                overrides: { formParameters: {}, parameters: {config: {}} },
                description: <React.Fragment>
                    <p>LPA is the best</p>
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
            <IndividualRecipe />
        </Route>
    </Switch>
}

const START = "start"
const END = "end"
const SLIDE = "slide"



const IndividualRecipeView = (props) => {
    const panelRef = React.createRef()
    const [selectedSlide, setSelectedSlide] = React.useState(0)
    const [page, setPage] = React.useState(START)


    const [localRecipes, setLocalRecipes] = React.useState(recipes)

    const addLimits = (params) => {
        return {
            ...params,
            limit: props.limit,
            communityNodeLimit: props.communityNodeLimit
        }
    }

    const {recipeId} = useParams();

    const addTaskIfMissing = () => {
        const selectedRecipe = localRecipes[recipeId];
        if (!selectedRecipe.slides[selectedSlide].task) {
            setLocalRecipes(localRecipes => {
                const newLocalRecipes = Object.assign({}, localRecipes)
                const group = selectedRecipe.slides[selectedSlide].group
                const algorithm = selectedRecipe.slides[selectedSlide].algorithm
                const {parameters, parametersBuilder} = getAlgorithmDefinitions(group, algorithm, props.metadata.versions.gdsVersion)

                const parametersWithOverrides = Object.assign(parameters, selectedRecipe.slides[selectedSlide].overrides.formParameters)

                const params = parametersBuilder({
                    ...parametersWithOverrides,
                    requiredProperties: Object.keys(parametersWithOverrides)
                })

                const formParameters = addLimits(parametersWithOverrides)
                const taskId = generateTaskId()

                selectedRecipe.slides[selectedSlide].task = {
                    group: group,
                    algorithm: algorithm,
                    status: ADDED,
                    taskId: taskId,
                    parameters: params,
                    formParameters,
                    persisted: false,
                    startTime: new Date(),
                    database: getActiveDatabase(),
                    activeItem: "Configure",
                    activeResultsItem: "Table"
                }
                return newLocalRecipes
            })
        }
    }

    React.useEffect(() => {
        if(page === SLIDE) {
            addTaskIfMissing()
        }
    }, [selectedSlide, recipeId, page])

    const selectedRecipe = localRecipes[recipeId]
    const maxSlide = selectedRecipe.slides.length

    const getStyle = name => name === selectedRecipe.slides[selectedSlide].task.activeItem ? {display: ''} : {display: 'none'}
    const getStyleResultsTab = name => name === selectedRecipe.slides[selectedSlide].task.activeItem ? {display: 'flex'} : {display: 'none'}
    const getResultsStyle = name => name === selectedRecipe.slides[selectedSlide].task.activeResultsItem ? {display: ''} : {display: 'none'}

    const selectedTask = selectedRecipe.slides[selectedSlide].task
    const activeGroup = selectedTask && selectedTask.group

    const updateSelectedTask = (updates) => {
        setLocalRecipes(localRecipes => {
            const newLocalRecipes = Object.assign({}, localRecipes)
            const existingTask = newLocalRecipes[recipeId].slides[selectedSlide].task
            newLocalRecipes[recipeId].slides[selectedSlide].task = {...existingTask, ...updates}
            return newLocalRecipes
        })
    }

    const updateSlide = (slideIds, formParameters) => {
        setLocalRecipes(localRecipes => {
            const newLocalRecipes = Object.assign({}, localRecipes)

            slideIds.forEach(slideId => {
                const overrides = newLocalRecipes[recipeId].slides[slideId].overrides
                overrides.formParameters = Object.assign(overrides.formParameters, formParameters)
            })

            return newLocalRecipes
        })
    }

    const handleResultsMenuItemClick = (e, {name}) => {
        updateSelectedTask({activeResultsItem: name})
    }

    return <React.Fragment>
        <TopNav selectedRecipe={selectedRecipe}/>
        <div className="recipe-body">
            <Container fluid>
                <div className="recipes">
                    <div className="recipe">
                    {page === START && <StartSlide key="start-slide" setPage={setPage} setSelectedSlide={setSelectedSlide} selectedRecipe={selectedRecipe} gdsVersion={props.metadata.versions.gdsVersion} />}
                    {page === END && <EndSlide key="end-slide" selectedRecipe={selectedRecipe}/>}
                    {page === SLIDE && selectedTask &&
                        <React.Fragment>
                        <div className="left">
                          <span className="recipe-heading">
                              {selectedRecipe.slides[selectedSlide].title}
                          </span>
                            {selectedRecipe.slides[selectedSlide].description}
                        </div>
                        <div className="right">
                            <SuccessTopBar task={selectedTask} panelRef={props.panelRef}
                                           activeItem={selectedTask.activeItem}
                                           activeGroup="Configure"
                                           handleMenuItemClick={(e, {name}) => updateSelectedTask({activeItem: name})}
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

                                                        const overrides = selectedRecipe.slides[selectedSlide].overrides;
                                                        const formParametersToPassOn = overrides.formParametersToPassOn || []

                                                        updateSlide(overrides.slidesToUpdate,
                                                            Object.assign({}, ...formParametersToPassOn.map(key => ({[key.target]: formParameters[key.source]})))
                                                        )
                                                    }
                                                },
                                                () => {
                                                    refreshMetadata(props)
                                                },
                                                (taskId, query, namedGraphQueries, parameters, formParameters, persisted) => {
                                                    updateSelectedTask({activeItem: "Results"})
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
                                        onCopy={(group, algorithm, newParameters, formParameters) => {
                                            updateSelectedTask({
                                                status: ADDED,
                                                result: null,
                                                query: null,
                                                namedGraphQueries: null,
                                                activeItem: "Configure",
                                                formParameters,
                                                parameters: newParameters
                                            })
                                        }}
                                    />
                                </div>

                                <div style={getStyleResultsTab("Results")}>
                                    <div>
                                        <Menu pointing secondary vertical className="resultsMenu">
                                            <Menu.Item
                                                name='Table'
                                                active={selectedTask.activeItem === 'Table'}
                                                onClick={handleResultsMenuItemClick}
                                            />

                                            {getGroup(selectedTask.algorithm) === "Centralities" &&
                                            <Menu.Item
                                                name='Chart'
                                                active={selectedTask.activeResultsItem === 'Chart'}
                                                onClick={handleResultsMenuItemClick}
                                            />}

                                            {!(getGroup(selectedTask.algorithm) === 'Path Finding' || getGroup(selectedTask.algorithm) === 'Similarity') &&
                                            <Menu.Item
                                                name='Visualisation'
                                                active={selectedTask.activeResultsItem === 'Visualisation'}
                                                onClick={handleResultsMenuItemClick}
                                            />}

                                        </Menu>
                                    </div>
                                    <div style={{flexGrow: "1", paddingLeft: "10px"}}>
                                        {!(activeGroup === 'Path Finding' || activeGroup === 'Similarity') ?
                                            <div style={getResultsStyle('Visualisation')}>
                                                <VisView task={selectedTask}
                                                         active={selectedTask.activeResultsItem === 'Visualisation'}/>
                                            </div> : null}

                                        {activeGroup === 'Centralities' ?
                                            <div style={getResultsStyle('Chart')}>
                                                <ChartView task={selectedTask}
                                                           active={selectedTask.activeResultsItem === 'Chart'}/>
                                            </div> : null}

                                        <div style={getResultsStyle('Table')}>
                                            <TableView task={selectedTask} gdsVersion={props.metadata.versions.gdsVersion}/>
                                        </div>
                                    </div>

                                </div>

                                <div style={getStyle('Code')}>
                                    <CodeView task={selectedTask}/>
                                </div>

                            </div>
                        </div>
                        </React.Fragment>
                    }
                    </div>
                </div>

                <BottomNav selectedSlide={selectedSlide} setSelectedSlide={setSelectedSlide}
                           page={page} setPage={setPage}
                           maxSlide={maxSlide}
                />
            </Container>
        </div>
    </React.Fragment>

}

const mapStateToProps = state => ({
    activeMenuItem: state.menu.item,
    limit: state.settings.limit,
    communityNodeLimit: state.settings.communityNodeLimit,
    metadata: state.metadata,
    tasks: state.tasks,
})

const mapDispatchToProps = dispatch => ({
    updateLimit: value => dispatch(limit(value)),
    setLabels: labels => dispatch(setLabels(labels)),
    setGds: version => dispatch(setVersions(version)),
    setRelationshipTypes: relationshipTypes => dispatch(setRelationshipTypes(relationshipTypes)),
    setPropertyKeys: propertyKeys => dispatch(setPropertyKeys(propertyKeys)),
    setNodePropertyKeys: propertyKeys => dispatch(setNodePropertyKeys(propertyKeys)),
    setDatabases: databases => dispatch(setDatabases(databases)),
    addDatabase: database => dispatch(addDatabase(database)),
    initLabel: (database, label, color, propertyKeys) => dispatch(initLabel(database, label, color, propertyKeys)),
    removeTask: (taskId) => {
        dispatch(removeTask({ taskId}))
    }
})

const IndividualRecipe =  connect(mapStateToProps, mapDispatchToProps)(IndividualRecipeView)

const StartSlide = ({selectedRecipe, gdsVersion, setPage, setSelectedSlide}) => {
    return  <div className="left-right">
           <div className="title">
            <span className="title">Welcome to the {selectedRecipe.name} recipe</span>
           </div>

            <p>{selectedRecipe.shortDescription}</p>

        <Card.Group className="algorithms">
            {selectedRecipe.slides.map((slide, idx) => {
                const algo = getAlgorithmDefinitions(slide.group, slide.algorithm, gdsVersion)
                return <Card key={"recipe" + idx}>
                <Card.Content>
                    <Card.Header>{slide.title}</Card.Header>
                    <Card.Description>
                        {algo.description}
                    </Card.Description>
                </Card.Content>
            </Card>})}
        </Card.Group>

        <div className='ui buttons'>
            <Button className="try-recipe" onClick={() => {
                setSelectedSlide(0)
                setPage(SLIDE)
            }}>
                Try out the recipe
            </Button>
        </div>

        </div>

}

const EndSlide = ({selectedRecipe}) => {
    const history = useHistory();

    return <div className="left-right">
        <div className="title">
        <span className="title">Congratulations for completing the {selectedRecipe.name} recipe</span>
        </div>
        <p>
            {selectedRecipe.completionMessage}
            <br />
            Below are some ideas for things to try next:
        </p>

        <Card.Group className="algorithms">
            <Card>
                <Card.Content>
                    <Card.Header>Another recipe</Card.Header>
                    <Card.Description>
                        Try out one of the other algorithm recipes
                    </Card.Description>
                </Card.Content>
                <Card.Content extra>
                    <div className='ui two buttons'>
                        <Button basic color='green' onClick={() => {
                            history.push("/recipes/")
                        }}>
                            Select
                        </Button>
                    </div>
                </Card.Content>
            </Card>

            <Card>
                <Card.Content>
                    <Card.Header>Run single algorithm</Card.Header>
                    <Card.Description>
                        Try out any of the algorithms in the Graph Data Science Library.
                    </Card.Description>
                </Card.Content>
                <Card.Content extra>
                    <div className='ui two buttons'>
                        <Button basic color='green' onClick={() => {
                            history.push("/algorithms/new")
                        }}>
                            Select
                        </Button>
                    </div>
                </Card.Content>
            </Card>

        </Card.Group>

    </div>
}

const BottomNav = ({selectedSlide, setSelectedSlide, page, setPage, maxSlide}) => {
    switch (page) {
        case START:
            return <div className="recipe-navigation">
                <Icon size="large" disabled={true} className="angle left disabled"/>
                <span>Browse</span>
                <Icon size="large" className="angle right" onClick={() =>  {
                    setPage(SLIDE)
                    setSelectedSlide(0)
                }} />
            </div>
        case END:
            return <div className="recipe-navigation">
                <Icon size="large" onClick={() => {
                    setPage(SLIDE)
                    setSelectedSlide(maxSlide-1)
                }} className="angle left"/>
                <span>Browse</span>
                <Icon size="large" className="angle right disabled" disabled={true}/>
            </div>
        default:
            return <div className="recipe-navigation">
                <Icon size="large" onClick={() => {
                    if(selectedSlide === 0) {
                        setPage(START)
                    } else {
                        setSelectedSlide(selectedSlide => selectedSlide - 1)
                    }

                }} className="angle left"/>
                <span>Browse</span>
                {selectedSlide < (maxSlide) &&
                <Icon size="large" className="angle right" onClick={() => {
                    if(selectedSlide === maxSlide - 1) {
                        setPage(END)
                    } else {
                        setSelectedSlide(selectedSlide => selectedSlide + 1)
                    }
                }}/>}
            </div>
    }
}

const TopNav = ({selectedRecipe}) => {
    const history = useHistory();

    return <React.Fragment>
        <nav className="top-nav">
            <Button onClick={() => {
                history.push("/recipes/")
            }} icon="left arrow" labelPosition="left" content="All algorithm recipes" className="back-to-algorithms"/>
        </nav>
        <div className="page-heading">
            {selectedRecipe.name}
        </div>
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
