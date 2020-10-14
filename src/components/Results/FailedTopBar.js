import {Menu} from "semantic-ui-react";
import React from "react";

export const FailedTopBar = ({ activeItem, handleMenuItemClick}) => {
    return <Menu attached='top' tabular pointing secondary className="results-bar"
                 style={{display: 'flex', justifyContent: 'space-between'}}>
        <div style={{display: 'flex'}}>
            <Menu.Item name='Configure' active={activeItem === 'Configure'} onClick={handleMenuItemClick}>1. Configure</Menu.Item>
            <Menu.Item name='Results' active={activeItem === 'Results'} onClick={handleMenuItemClick}>2. Results</Menu.Item>
            <Menu.Item name='Code' active={activeItem === 'Code'} onClick={handleMenuItemClick}>3. Code</Menu.Item>
        </div>
    </Menu>
}
