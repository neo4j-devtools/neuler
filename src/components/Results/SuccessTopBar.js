import  {Dropdown, Button, Form, Header, Icon, Image, Menu} from "semantic-ui-react";
import React from "react";
import html2canvas from "html2canvas";
import {v4 as generateId} from "uuid";
import {ReImg} from "reimg";
import {ADDED, COMPLETED, RUNNING} from "../../ducks/tasks";

const printElement = element => {
    html2canvas(element).then(function (canvas) {
        const guid = generateId()
        ReImg.fromCanvas(canvas).downloadPng(`neuler-${guid}.png`);
    })
}

export const SuccessTopBar = ({task, activeItem, activeGroup, prevResult, nextResult, currentPage, totalPages, handleMenuItemClick, panelRef, tasks, setSelectedTaskId}) => {
    return <Menu attached='top' tabular pointing secondary className="results-bar"
                 style={{display: 'flex', justifyContent: 'space-between'}}>
        <div style={{display: 'flex'}}>
            <Menu.Item name="Configure" active={activeItem === 'Configure'} onClick={handleMenuItemClick}>
                1. Configure
            </Menu.Item>

                {[RUNNING, COMPLETED].includes(task.status) ?
                    <React.Fragment>
                        <Menu.Item name="Results" active={activeItem === 'Results'} onClick={handleMenuItemClick}>
                            2. Results
                        </Menu.Item>

                        {/*<Menu.Item name='Table' active={activeItem === 'Table'} onClick={handleMenuItemClick}/>*/}

                        {/*{activeGroup === 'Centralities' ?*/}
                        {/*    <Menu.Item name='Chart' active={activeItem === 'Chart'} onClick={handleMenuItemClick}/>*/}
                        {/*    : null*/}
                        {/*}*/}

                        {/*{!(activeGroup === 'Path Finding' || activeGroup === 'Similarity') ?*/}
                        {/*    <Menu.Item name='Visualisation' active={activeItem === 'Visualisation'}*/}
                        {/*               onClick={handleMenuItemClick}/>*/}
                        {/*    : null*/}
                        {/*}*/}

                        <Menu.Item name='Code' active={activeItem === 'Code'} onClick={handleMenuItemClick}>
                            3. Code
                        </Menu.Item>

                        {/*<Menu.Menu position='right'>*/}
                        {/*    <Menu.Item active={activeItem === 'Printscreen'}*/}
                        {/*               onClick={(() => printElement(panelRef.current))}>*/}
                        {/*        <Image src='images/Camera2.png'/>*/}
                        {/*    </Menu.Item>*/}
                        {/*</Menu.Menu>*/}
                    </React.Fragment> : null}
        </div>
    </Menu>
}

export const NavBar = ({task, tasks, setSelectedTaskId}) => {
    const createMessage = (task) => {
        return task.status !== ADDED ? ` (Started at: ${task.startTime.toLocaleTimeString()})` : ""
    }

    const taskOptions = tasks.map(value => {
        return {key: value.taskId, value: value.taskId, text: value.algorithm + createMessage(value)};
    })

    return <div style={{
        margin: "3px"
    }}>
        <Form>
        <Dropdown options={taskOptions} text="Algorithm runs" search selection value={task.taskId} onChange={(evt, data) => setSelectedTaskId(data.value)} >
        </Dropdown>
        </Form>
    </div>
}
