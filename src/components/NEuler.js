import React from 'react'
import {Container} from "semantic-ui-react"

import AlgorithmsGroupMenu from "./AlgorithmGroupsMenu"
import MainContent from './MainContent'
import Datasets from './Datasets'
import {connect} from "react-redux"
import {limit} from "../ducks/settings"
import {setLabels, setPropertyKeys, setRelationshipTypes} from "../ducks/metadata"
import Home from "./Home";
import About from "./About";
import {FeedbackForm} from "./Feedback/FeedbackForm";
import {refreshMetadata} from "./Startup/startup";
import constants from "../constants.js";
import SelectDatabase from "./SelectDatabase";
import {Recipe} from "./Recipe";

const NEuler = (props) => {
    return (
        <div>dummy</div>
    )
}



export default NEuler
