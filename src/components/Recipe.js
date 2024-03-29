import {connect} from "react-redux";
import {selectAlgorithm} from "../ducks/algorithms";
import React from "react";
import {getAlgorithmDefinitions, getGroup} from "./algorithmsLibrary";
import {v4 as generateTaskId} from "uuid";
import {ADDED, COMPLETED, FAILED, removeTask, RUNNING} from "../ducks/tasks";
import {getActiveDatabase} from "../services/stores/neoStore";
import {Button, Card, CardGroup, Container, Icon, Menu, Message} from "semantic-ui-react";
import {SuccessTopBar} from "./Results/SuccessTopBar";
import {TableView} from "./Results/TableView";
import CodeView from "./CodeView";
import {ChartView} from "./Results/ChartView";
import {communityNodeLimit, limit} from "../ducks/settings";
import {
    addDatabase,
    initLabel,
    setDatabases,
    setLabels,
    setNodePropertyKeys,
    setPropertyKeys,
    setRelPropertyKeys,
    setRelationshipTypes,
    setVersions
} from "../ducks/metadata";
import {AlgoFormView} from "./AlgorithmForm";

import {Route, Switch, useHistory, useParams, useRouteMatch} from "react-router-dom";
import {onRunAlgo} from "../services/tasks";
import {refreshMetadata} from "./Startup/startup";
import {FailedTopBar} from "./Results/FailedTopBar";
import {sendMetrics} from "./metrics/sendMetrics";
import {recipes} from "./Recipes";
import {NewVisView} from "./Results/NewVisView";

const containerStyle = {
    padding: '1em'
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
                <Recipes recipes={recipes(props.metadata.versions.gdsVersion)}/>


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


    const [localRecipes, setLocalRecipes] = React.useState(recipes(props.metadata.versions.gdsVersion))

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
                const newSelectedRecipe = newLocalRecipes[recipeId]

                const group = newSelectedRecipe.slides[selectedSlide].group
                const algorithm = newSelectedRecipe.slides[selectedSlide].algorithm
                const {parameters, parametersBuilder} = getAlgorithmDefinitions(group, algorithm, props.metadata.versions.gdsVersion)

                const parametersWithOverrides = Object.assign(parameters, newSelectedRecipe.slides[selectedSlide].overrides.formParameters)

                const params = parametersBuilder({
                    ...parametersWithOverrides,
                    requiredProperties: Object.keys(parametersWithOverrides)
                })

                const formParameters = addLimits(parametersWithOverrides)
                const taskId = generateTaskId()

                newSelectedRecipe.slides[selectedSlide].task = {
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
                            { selectedTask.status !== FAILED &&
                            <SuccessTopBar task={selectedTask} panelRef={props.panelRef}
                                           activeItem={selectedTask.activeItem}
                                           handleMenuItemClick={(e, {name}) => updateSelectedTask({activeItem: name})}
                            />}

                            { selectedTask.completed && selectedTask.status === FAILED &&
                            <FailedTopBar activeItem={selectedTask.activeItem}
                                          handleMenuItemClick={(e, {name}) => updateSelectedTask({activeItem: name})}
                            />}

                            <div ref={panelRef}>
                                <div style={getStyle("Configure")}>
                                    <AlgoForm
                                        selectedAlgorithmReadOnly={true}
                                        task={selectedTask}
                                        limit={props.limit}
                                        onRun={(newParameters, formParameters, persisted) => {
                                            onRunAlgo(selectedTask, newParameters, formParameters, persisted, props.metadata.versions,
                                                (taskId, result, error) => {
                                                    sendMetrics("neuler", "ran-recipe-algorithm", {algorithm: selectedTask.algorithm, group: selectedTask.group, recipe: selectedRecipe.name})
                                                    if (error) {
                                                        updateSelectedTask({status: FAILED, result, error, completed: true})
                                                    } else {
                                                        updateSelectedTask({status: COMPLETED, result, completed: true})

                                                        const overrides = selectedRecipe.slides[selectedSlide].overrides;
                                                        const formParametersToPassOn = overrides.formParametersToPassOn || []
                                                        if(overrides.slidesToUpdate) {
                                                            updateSlide(overrides.slidesToUpdate,
                                                                Object.assign({}, ...formParametersToPassOn.map(key => ({[key.target]: formParameters[key.source]})))
                                                            )
                                                        }
                                                    }
                                                },
                                                () => {
                                                    refreshMetadata(props)
                                                },
                                                (taskId, query, namedGraphQueries, parameters, formParameters, persisted) => {
                                                    updateSelectedTask({
                                                        activeItem: "Results",
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

                                {selectedTask.status !== FAILED &&
                                <SuccessResults getStyleResultsTab={getStyleResultsTab}
                                                selectedTask={selectedTask}
                                                handleResultsMenuItemClick={handleResultsMenuItemClick}
                                                activeGroup={activeGroup}
                                                getResultsStyle={getResultsStyle}
                                                gdsVersion={props.metadata.versions.gdsVersion}
                                />}
                                {selectedTask.completed && selectedTask.status === FAILED && <ErrorResults getStyleResultsTab={getStyleResultsTab} selectedTask={selectedTask} />   }


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

const SuccessResults = ({getStyleResultsTab, selectedTask, handleResultsMenuItemClick, activeGroup, getResultsStyle, gdsVersion}) => {
    return <div style={getStyleResultsTab("Results")}>
        <div>
            <Menu pointing secondary vertical className="resultsMenu">
                <Menu.Item
                    name='Table'
                    active={selectedTask.activeItem === 'Table'}
                    onClick={handleResultsMenuItemClick}
                />

                {getGroup(selectedTask.algorithm, gdsVersion) === "Centralities" &&
                <Menu.Item
                    name='Chart'
                    active={selectedTask.activeResultsItem === 'Chart'}
                    onClick={handleResultsMenuItemClick}
                />}

                {!(getGroup(selectedTask.algorithm, gdsVersion) === 'Path Finding' || getGroup(selectedTask.algorithm, gdsVersion) === 'Similarity') &&
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
                    <NewVisView task={selectedTask}
                             active={selectedTask.activeResultsItem === 'Visualisation'}/>
                </div> : null}

            {activeGroup === 'Centralities' ?
                <div style={getResultsStyle('Chart')}>
                    <ChartView task={selectedTask}
                               active={selectedTask.activeResultsItem === 'Chart'}/>
                </div> : null}

            <div style={getResultsStyle('Table')}>
                <TableView task={selectedTask} gdsVersion={gdsVersion}/>
            </div>
        </div>
    </div>
}

const ErrorResults = ({selectedTask, getStyleResultsTab}) => {
    return <div style={getStyleResultsTab('Results')}>
        <Message warning compact>
            <Message.Header>Algorithm failed to complete</Message.Header>
            <p>{selectedTask.error}</p>
        </Message>
    </div>
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
    setRelPropertyKeys: propertyKeys => dispatch(setRelPropertyKeys(propertyKeys)),
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

        <div className="ui cards algorithms">
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
        </div>

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

        <div className="ui cards algorithms">
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

        </div>

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
