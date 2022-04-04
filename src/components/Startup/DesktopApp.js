import React from 'react'
import {Container, Divider, Segment} from "semantic-ui-react"
import NEuler from "../NEuler"
import '../../App.css'
import {selectAlgorithm, selectGroup} from "../../ducks/algorithms"
import {connect} from "react-redux"
import {
  setDatabases,
  setLabels,
  setNodePropertyKeys,
  setPropertyKeys,
  setRelPropertyKeys,
  setRelationshipTypes,
  setVersions
} from "../../ducks/metadata"
import {CONNECTED, setConnected, setDisconnected} from "../../ducks/connection"
import {initializeDesktopConnection} from "../../services/connections"
import {addDatabase, initLabel} from "../../ducks/metadata";
import {
  ALL_DONE,
  CHECKING_APOC_PLUGIN,
  CHECKING_GDS_PLUGIN,
  CONNECTING_TO_DATABASE,
  refreshMetadata,
  steps
} from "./startup";
import {LoadingIcon} from "./LoadingIcon";
import {DesktopAppLoadingArea} from "./DesktopAppLoadingArea";
import {FeedbackForm} from "../Feedback/FeedbackForm";
import constants from "../../constants";
import {Redirect} from "react-router-dom";


const NewApp = (props) => {
  return <div>
    dummy
  </div>
}

export default NewApp
