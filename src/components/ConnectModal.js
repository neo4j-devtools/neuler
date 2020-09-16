import React, {Component} from 'react'
import {Render} from 'graph-app-kit/components/Render'
import {Button, Divider, Dropdown, Form, Input, Message} from 'semantic-ui-react'

const ConnectForm = (props) => {
    const {errorMsg, extraErrorMessage, clearErrorMessages} = props
    const [username, setUsername] = React.useState("neo4j")
    const [password, setPassword] = React.useState("")
    const [scheme, setScheme] = React.useState("neo4j")
    const [address, setAddress] = React.useState("localhost")
    const [port, setPort] = React.useState(7687)
    const onSubmit = () => {
        const boltUri = `${scheme}://${address}:${port}`
        props.onSubmit(boltUri, username, password)
    };

    const schemeOptions = [
        {key: 'neo4j', value: 'neo4j', text: 'neo4j'},
        {key: 'neo4j+s', value: 'neo4j+s', text: 'neo4j+s'},
        {key: 'neo4j+ssc', value: 'neo4j+ssc', text: 'neo4j+ssc'},
    ]

    return (
        <div className="loading-container">
            <Message color="grey" attached={true} header="Connect to Neo4j Server"/>
            <Form error={!!errorMsg} onSubmit={onSubmit} className='attached fluid segment'>
                <Form.Field>
                    <label>Server Address</label>
                    <Form.Field inline>
                    <Dropdown  style={{minWidth: "7em"}}
                        selection search value={scheme}
                        options={schemeOptions}
                        onChange={(_, {value}) => {
                            clearErrorMessages()
                            setScheme(value)
                        }}
                               onClick={clearErrorMessages}
                    />
                        <p style={{margin: "0 .85714286em 0 0"}}>://</p>
                    <Input style={{margin: "0 .85714286em 0 0"}}
                        value={address}
                        name='address'
                        onChange={(_, {value}) => {
                            clearErrorMessages()
                            setAddress(value)
                        }}
                           onClick={clearErrorMessages}
                        placeholder='Server Address'
                    />
                    <p style={{margin: "0 .85714286em 0 0"}}>:</p>
                        <Input style={{width: "7em", minWidth: "7em"}}
                            value={port}
                            type="number"
                            name='port'
                            onChange={(_, {value}) => {
                                setPort(value)
                                clearErrorMessages()
                            }}
                               onClick={clearErrorMessages}
                            placeholder='Port'
                        />

                    </Form.Field>


                </Form.Field>

                <Form.Field>
                    <label>Username</label>
                    <Input
                        value={username}
                        name='username'
                        onChange={(_, {value}) => {
                            clearErrorMessages()
                            setUsername(value)
                        }}
                        onClick={clearErrorMessages}
                        placeholder='Username'
                    />
                </Form.Field>
                <Form.Field>
                    <label>Password</label>
                    <Input
                        value={password}
                        name='password'
                        onChange={(_, {value}) => {
                            clearErrorMessages()
                            setPassword(value)
                        }}
                        onClick={clearErrorMessages}
                        type='password'
                        placeholder='Password'
                    />
                </Form.Field>
                <Render if={errorMsg}>
                    <Message error>
                        <Message.Header>
                            Error connecting to {scheme}://{address}:{port}
                        </Message.Header>
                        <Message.Content>
                            {errorMsg}
                        </Message.Content>
                        <Divider />
                        <Message.Content style={{fontStyle: "italic"}}>
                            <p>
                                {extraErrorMessage}
                            </p>
                        </Message.Content>
                    </Message>
                </Render>
                <Divider />
                <Button
                    onClick={() => {
                        clearErrorMessages()
                        onSubmit()
                    }}
                    positive
                    icon='right arrow'
                    labelPosition='right'
                    content='Connect'
                />
            </Form>

        </div>
    )

}

export class ConnectModal extends Component {
    state = {
        showModal: true,
        initial: true
    };

    onSubmit = (boltUri, username, password) => {
        this.setState({initial: false}, () => {
            this.props.onSubmit(boltUri, username, password)
        })
    };

    render() {
        const errorMsg = this.state.initial ? false : this.props.errorMsg
        return (
            <ConnectForm
                onSubmit={this.onSubmit}
                errorMsg={errorMsg}
                extraErrorMessage={this.props.extraErrorMessage}
                clearErrorMessages={this.props.clearErrorMessages}
            />
        )
    }
}
