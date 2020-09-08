import {Button, Header, Icon, Image, Menu} from "semantic-ui-react";
import React from "react";
import html2canvas from "html2canvas";
import {v4 as generateId} from "uuid";
import {ReImg} from "reimg";

const printElement = element => {
    html2canvas(element).then(function (canvas) {
        const guid = generateId()
        ReImg.fromCanvas(canvas).downloadPng(`neuler-${guid}.png`);
    })
}


export const SuccessTopBar = ({task, activeItem, activeGroup, prevResult, nextResult, currentPage, totalPages, handleMenuItemClick, panelRef}) => {
    return <Menu attached='top' tabular pointing secondary
                 style={{display: 'flex', justifyContent: 'space-between'}}>
        <div style={{display: 'flex'}}>

            <Menu.Item name='Table' active={activeItem === 'Table'} onClick={handleMenuItemClick}/>

            {activeGroup === 'Centralities' ?
                <Menu.Item name='Chart' active={activeItem === 'Chart'} onClick={handleMenuItemClick}/>
                : null}

            {!(activeGroup === 'Path Finding' || activeGroup === 'Similarity') ?
                <Menu.Item name='Visualisation' active={activeItem === 'Visualisation'} onClick={handleMenuItemClick}/>
                : null
            }

            <Menu.Item name='Code' active={activeItem === 'Code'} onClick={handleMenuItemClick}/>

            <Menu.Item active={activeItem === 'Printscreen'} onClick={(() => printElement(panelRef.current))}>
                <Image src='images/Camera2.png'/>
            </Menu.Item>

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