import {Button, Header, Icon, Menu} from "semantic-ui-react";
import React from "react";

export const FailedTopBar = ({task, activeItem, prevResult, nextResult, currentPage, totalPages, handleMenuItemClick}) => {
    return <Menu attached='top' tabular pointing secondary
                 style={{display: 'flex', justifyContent: 'space-between'}}>
        <div style={{display: 'flex'}}>
            <Menu.Item name='Configure' active={activeItem === 'Configure'} onClick={handleMenuItemClick}/>
            <Menu.Item name='Error' active={activeItem === 'Error'} onClick={handleMenuItemClick}/>
            <Menu.Item name='Code' active={activeItem === 'Code'} onClick={handleMenuItemClick}/>
        </div>
        <div style={{
            display: 'flex',
            alignItems: 'center'
        }}>
            <Button basic icon size='mini' onClick={prevResult} disabled={currentPage === 1}>
                <Icon name='angle left'/>
            </Button>
            <Header as='h3' style={{margin: '0 1em'}}>
                {`${task.algorithm} Started at: ${task.startTime.toLocaleTimeString()} - (${currentPage} / ${totalPages})`}
            </Header>
            <Button basic icon size='mini' onClick={nextResult} disabled={currentPage === totalPages}>
                <Icon name='angle right'/>
            </Button>
        </div>
    </Menu>
}