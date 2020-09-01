import React, {Component} from 'react'
import {Render} from 'graph-app-kit/components/Render'
import {Button, Form, Input, Modal, Message, Segment} from 'semantic-ui-react'

class ConnectForm extends Component {
    state = {
        username: '',
        password: ''
    };
    inputUpdated = (_, {name, value}) => {
        this.setState({[name]: value})
    };
    onSubmit = () => {
        const {username, password} = this.state
        this.props.onSubmit(username, password)
    };

    render() {
        const {open, errorMsg, onClose} = this.props
        const {username, password} = this.state
        return (
            <div style={{padding: "20px"}}>
                <Message grey attached header="Connect to the active graph"/>
                <Form error={!!errorMsg} onSubmit={this.onSubmit} className='attached fluid segment'>
                    <Form.Field>
                        <Input
                            label="Username"
                            value={username}
                            name='username'
                            onChange={this.inputUpdated}
                            placeholder='Username'
                        />
                    </Form.Field>
                    <Form.Field>
                        <Input
                            label="Password"
                            value={password}
                            name='password'
                            onChange={this.inputUpdated}
                            type='password'
                            placeholder='Password'
                        />
                    </Form.Field>
                    <Render if={errorMsg}>
                        <Message error header='An error occurred' content={errorMsg}/>
                    </Render>
                    <Button
                        onClick={this.onSubmit}
                        positive
                        icon='right arrow'
                        labelPosition='right'
                        content='Connect'
                    />
                </Form>

            </div>
        )
    }
}

export class ConnectModal extends Component {
    state = {
        showModal: true,
        initial: true
    };
    closeModal = () => {
        this.setState({showModal: false})
    };
    onSubmit = (username, password) => {
        this.setState({initial: false}, () => {
            this.props.onSubmit(username, password)
        })
    };

    render() {
        const errorMsg = this.state.initial ? false : this.props.errorMsg
        return (
            <ConnectForm
                onClose={this.closeModal}
                onSubmit={this.onSubmit}
                errorMsg={errorMsg}
                open={this.props.show && this.state.showModal}
            />
        )
    }
}
