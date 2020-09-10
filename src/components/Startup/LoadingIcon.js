import {Icon, Loader} from "semantic-ui-react";
import React from "react";
import {steps} from "./startup";


export const LoadingIcon = ({step, currentStep, currentStepFailed}) => {
    const currentIndex = steps.indexOf(currentStep)
    const stepIndex = steps.indexOf(step)

    if (step === currentStep) {
        return currentStepFailed ?
            <Icon size="big" name='close' color='red' className="loading-icon"/> :
            <Loader active inline className="loading-icon" size="large"/>;
    } else {
        if (stepIndex > currentIndex) {
            return <Icon size="big" name='circle notch' color='grey' className="loading-icon"/>
        } else {
            return <Icon size="big" name='checkmark' color='green' className="loading-icon"/>
        }
    }
}