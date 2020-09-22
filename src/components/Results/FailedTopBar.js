import {Menu} from "semantic-ui-react";
import React from "react";
import {NavBar} from "./SuccessTopBar";

export const FailedTopBar = ({task, activeItem, handleMenuItemClick, tasks, setSelectedTaskId}) => {
    return <Menu attached='top' tabular pointing secondary className="results-bar"
                 style={{display: 'flex', justifyContent: 'space-between'}}>
        <div style={{display: 'flex'}}>
            <Menu.Item name='Configure' active={activeItem === 'Configure'} onClick={handleMenuItemClick}/>
            <Menu.Item name='Error' active={activeItem === 'Error'} onClick={handleMenuItemClick}/>
            <Menu.Item name='Code' active={activeItem === 'Code'} onClick={handleMenuItemClick}/>
        </div>
        <NavBar task={task}tasks={tasks} setSelectedTaskId={setSelectedTaskId} />
    </Menu>
}
