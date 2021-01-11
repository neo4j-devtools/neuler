import React from "react";
import {sendMetrics} from "./metrics/sendMetrics";
import {ADDED, FAILED} from "../ducks/tasks";
import {FailedTopBar} from "./Results/FailedTopBar";
import AlgorithmForm from "./AlgorithmForm";
import {Menu, Message} from "semantic-ui-react";
import CodeView from "./CodeView";
import {SuccessTopBar} from "./Results/SuccessTopBar";
import {getGroup} from "./algorithmsLibrary";
import {ChartView} from "./Results/ChartView";
import {TableView} from "./Results/TableView";
import {NewVisView} from "./Results/NewVisView";

export const SingleTask = (props) => {
    const {task, currentPage, totalPages} = props

    const panelRef = React.createRef()
    const [activeItem, setActiveItem] = React.useState("Results")
    const [activeResultsItem, setActiveResultsItem] = React.useState("Table")

    const handleMenuItemClick = (e, {name}) => {
        sendMetrics('neuler-click-view', name)
        setActiveItem(name)
    }

    const handleResultsMenuItemClick = (e, {name}) => {
        sendMetrics('neuler-click-view', name)
        setActiveResultsItem(name)
    }

    React.useEffect(() => {
        if (task.status === ADDED) {
            setActiveItem("Configure")
        } else {
            setActiveItem("Results")
        }
    }, [task.status])

    const activeGroup = task.group
    const getStyle = name => name === activeItem ? {display: ''} : {display: 'none'}
    const getStyleResultsTab = name => name === activeItem ? {display: 'flex'} : {display: 'none'}
    const getResultsStyle = name => name === activeResultsItem ? {display: ''} : {display: 'none'}

    return (<React.Fragment>
        <div className="page-heading">
            {task.group} / {task.algorithm} - Started at {task.startTime.toLocaleTimeString()}
        </div>


        <div className="top-level-container">
            {task.completed && task.status === FAILED ? (
                    <React.Fragment>
                        <FailedTopBar task={task} activeItem={activeItem}
                                      currentPage={currentPage} totalPages={totalPages}
                                      handleMenuItemClick={handleMenuItemClick.bind(this)}
                        />

                        <div style={{marginTop: "10px"}}>
                            <div style={getStyle("Configure")}>
                                <AlgorithmForm
                                    task={task}
                                    limit={props.limit}
                                    onRun={() => {}}
                                    onCopy={(group, algorithm, newParameters, formParameters) => {
                                        props.onCopyAlgo(group, algorithm, newParameters, formParameters)
                                    }}
                                />
                            </div>
                            <div style={getStyle('Results')}>
                                <Message warning>
                                    <Message.Header>Algorithm failed to complete</Message.Header>
                                    <p>{task.error}</p>
                                </Message>
                            </div>
                            <div style={getStyle('Code')}>
                                <CodeView task={task}/>
                            </div>
                        </div>
                    </React.Fragment>
                )
                : <React.Fragment>
                    <SuccessTopBar task={task} activeItem={activeItem} activeGroup={activeGroup}
                                   panelRef={panelRef} handleMenuItemClick={handleMenuItemClick}
                    />
                    <div ref={panelRef}>
                        <div>
                            <div style={getStyle("Configure")}>
                                <AlgorithmForm
                                    task={task}
                                    limit={props.limit}
                                    onRun={() => {}}
                                    onCopy={(group, algorithm, newParameters, formParameters) => {
                                        props.onCopyAlgo(group, algorithm, newParameters, formParameters)
                                    }}
                                />
                            </div>

                            <div style={getStyle('Code')}>
                                <CodeView task={task}/>
                            </div>


                            <div style={getStyleResultsTab("Results")}>
                                <div>
                                    <Menu pointing secondary vertical className="resultsMenu">
                                        <Menu.Item
                                            name='Table'
                                            active={activeResultsItem === 'Table'}
                                            onClick={handleResultsMenuItemClick}
                                        />

                                        {getGroup(task.algorithm) === "Centralities" &&
                                        <Menu.Item
                                            name='Chart'
                                            active={activeResultsItem === 'Chart'}
                                            onClick={handleResultsMenuItemClick}
                                        />}

                                        {!(getGroup(task.algorithm) === 'Path Finding' || getGroup(task.algorithm) === 'Similarity') &&
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
                                        <NewVisView task={task} active={activeResultsItem === 'Visualisation'}/>
                                    </div> : null}

                                    {activeGroup === 'Centralities' ?
                                        <div style={getResultsStyle('Chart')}>
                                            <ChartView task={task} active={activeResultsItem === 'Chart'}/>
                                        </div> : null}

                                    <div style={getResultsStyle('Table')}>
                                        <TableView task={task} gdsVersion={props.gdsVersion}/>
                                    </div>
                                </div>

                            </div>

                        </div>
                    </div>

                </React.Fragment>
            }
        </div></React.Fragment>
    )

}
