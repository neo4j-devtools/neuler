import {Dropdown, Form, Menu} from "semantic-ui-react";
import React from "react";
import {ADDED, COMPLETED, RUNNING} from "../../ducks/tasks";

// const printElement = element => {
//     html2canvas(element).then(function (canvas) {
//         const guid = generateId()
//         ReImg.fromCanvas(canvas).downloadPng(`neuler-${guid}.png`);
//     })
// }

export const SuccessTopBar = ({task, activeItem, handleMenuItemClick}) => {
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

                        <Menu.Item name='Code' active={activeItem === 'Code'} onClick={handleMenuItemClick}>
                            3. Code
                        </Menu.Item>
                    </React.Fragment> : null}
        </div>
    </Menu>
}

export const NewTopBar = () => {
    return <Menu attached='top' tabular pointing secondary className="results-bar"
                 style={{display: 'flex', justifyContent: 'space-between'}}>
        <div style={{display: 'flex'}}>
            <Menu.Item name="Configure" active={true}>
                1. Configure
            </Menu.Item>

                    <Menu.Item name="Results" active={false} disabled={true}>
                        2. Results
                    </Menu.Item>

                    <Menu.Item name='Code' active={false}  disabled={true}>
                        3. Code
                    </Menu.Item>
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
