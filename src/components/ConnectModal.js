import React from 'react'
import {Render} from 'graph-app-kit/components/Render'
import {Button, Divider, Dropdown, Form, Input, Message} from 'semantic-ui-react'

const defaultUrlComponents = { scheme: "neo4j", port: 7687, address: "localhost"}

const schemeOptions = [
    {key: 'neo4j', value: 'neo4j', text: 'neo4j'},
    {key: 'neo4j+s', value: 'neo4j+s', text: 'neo4j+s'},
    {key: 'neo4j+ssc', value: 'neo4j+ssc', text: 'neo4j+ssc'},
    {key: 'bolt', value: 'bolt', text: 'bolt'},
    {key: 'bolt+s', value: 'bolt+s', text: 'bolt+s'},
    {key: 'bolt+ssc', value: 'bolt+ssc', text: 'bolt+ssc'},
]

export const extractComponents = (url) => {
    // http://localhost:3000/?username=training&url=localhost&accessToken=training
    // http://localhost:3000/?username=movies&url=neo4j://demo.neo4jlabs.com&accessToken=movies
    // http://localhost:3000?url=bolt://100.25.221.22:41382&username=neo4j&accessToken=headquarters-ampere-jewel

    if (!url) {
        return defaultUrlComponents
    }

    let [scheme, theRest] = url.split("://")
    if (!scheme) {
        return defaultUrlComponents
    }

    if (!schemeOptions.map(option => option.key).includes(scheme)) {
        scheme = "neo4j"
    }

    if (!theRest) {
        theRest = "localhost:7687"
    }

    const urlParts = theRest.split(":");
    if (urlParts.length > 1) {
        return {scheme: scheme, port: parseInt(urlParts[urlParts.length - 1]), address: urlParts[0]}
    } else {
        return {scheme: scheme, address: urlParts[0], port: 7687}
    }
}

const ConnectForm = (props) => {
    const {errorMsg, extraErrorMessage, clearErrorMessages} = props
    const [username, setUsername] = React.useState("neo4j")
    const [password, setPassword] = React.useState("")
    const [scheme, setScheme] = React.useState("neo4j")
    const [address, setAddress] = React.useState("localhost")
    const [port, setPort] = React.useState(7687)

    const [rawServerAddress, setRawServerAddress] = React.useState(false)
    const [rawBoltUri, setRawBoltUri] = React.useState("neo4j://localhost:7687")

    const updateComponentsFromRaw = () => {
        const components = extractComponents(rawBoltUri)
        setScheme(components.scheme)
        setPort(components.port)
        setAddress(components.address)
    }

    const updateRawFromComponents = () => {
        setRawBoltUri(`${scheme}://${address}:${port}`)
    }

    const onSubmit = () => {
        const boltUri = rawServerAddress ? rawBoltUri : `${scheme}://${address}:${port}`

        let [theScheme] = boltUri.split("://")
        if(!schemeOptions.map(value => value.key).includes(theScheme)) {
            props.hasError()
            props.setErrorMessage("Could not get a connection! Unknown scheme: " + theScheme + ". ")
            props.setExtraErrorMessage("Valid schemes are: " + schemeOptions.map(value => value.key))
        } else {
            props.onSubmit(boltUri, username, password)
        }

    };

    React.useEffect(() => {
        setUsername(props.queryParameters.username || "neo4j")
        setPassword(props.queryParameters.accessToken || "")

        const {scheme, port, address} = extractComponents(props.queryParameters.url)
        setScheme(scheme)
        setPort(port)
        setAddress(address)

    }, [props.queryParameters])


    return (
        <div className="loading-container">
            <Message color="grey" attached={true} header="Connect to Neo4j Server"/>
            <Form error={!!errorMsg} onSubmit={onSubmit} className='attached fluid segment'>
                <Form.Field>
                    <label>Server Address</label>
                    <Form.Field inline>
                        {!rawServerAddress && <React.Fragment>
                            <Dropdown style={{minWidth: "7em"}}
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
                        <Input style={{width: "7em", minWidth: "7em", marginRight: "1em"}}
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
                        </React.Fragment>}

                        {rawServerAddress &&
                        <Input style={{width: "31.45rem"}}
                            value={rawBoltUri}
                            name='boltUri'
                            onChange={(_, {value}) => {
                                clearErrorMessages()
                                setRawBoltUri(value)
                            }}
                            onClick={clearErrorMessages}
                            placeholder='Bolt URI'
                        />
                        }
                        <div className="ui input">
                        <a href="#" onClick={() => {
                            clearErrorMessages()
                            setRawServerAddress(!rawServerAddress)
                            if(rawServerAddress) {
                                updateComponentsFromRaw()
                            } else {
                                updateRawFromComponents()
                            }
                        }}>{!rawServerAddress ? "Raw" : "Structured"}</a>
                        </div>

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
                        <Divider/>
                        <Message.Content style={{fontStyle: "italic"}}>
                            <p>
                                {extraErrorMessage}
                            </p>
                        </Message.Content>
                    </Message>
                </Render>
                <Divider/>
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

export const ConnectModal = (props) => {
    const [initial, setInitial] = React.useState(true)
    const onSubmit = (boltUri, username, password) => {
        setInitial(false)
        props.onSubmit(boltUri, username, password)
    };

    const errorMsg = initial ? false : props.errorMsg
    return (
        <ConnectForm
            onSubmit={onSubmit}
            hasError={() => setInitial(false)}
            setErrorMessage={props.setErrorMessage}
            queryParameters={props.queryParameters}
            errorMsg={errorMsg}
            extraErrorMessage={props.extraErrorMessage}
            setExtraErrorMessage={props.setExtraErrorMessage}
            clearErrorMessages={props.clearErrorMessages}
        />
    )
}
