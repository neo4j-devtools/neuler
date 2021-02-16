import {Button, Message, Table} from "semantic-ui-react";
import React from "react";
import {connect} from "react-redux";
import NodeLabel from "../NodeLabel";


const SelectedDatabase = ({metadata, onRefresh}) => {
    return <div>
        <Message color="grey" style={{color: "#000000"}}>
            <Message.Header>
                Database Contents
            </Message.Header>
            <Message.Content>
                <Table basic='very' celled collapsing>
                    <Table.Body>
                        <Table.Row>
                            <Table.Cell style={{width: "150px"}}>Node Labels</Table.Cell>
                            <Table.Cell style={{display: "flex", flexWrap: "wrap"}}>{
                                metadata.labels.map(value => <NodeLabel key={value.label} database={metadata.activeDatabase} labels={[value.label]} caption={value.label} />)
                            }
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell style={{width: "150px"}}>Relationship Types</Table.Cell>
                            <Table.Cell>{
                                metadata.relationshipTypes.map(value => <span style={{"background": "#ccc"}} key={value.label} className="label">{value.label}</span>)
                            }
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>

                <Button size="tiny"  className="code" onClick={ (event, data) => {
                    const target = event.target
                    target.textContent = "Refreshing";
                    setTimeout( () => {
                        target.textContent = "Refresh";
                    }, 2000);

                    onRefresh()
                }}>
                    Refresh
                </Button>
            </Message.Content>
        </Message>
    </div>
}

const mapStateToProps = state => ({
    metadata: state.metadata
})

export default connect(mapStateToProps)(SelectedDatabase)
