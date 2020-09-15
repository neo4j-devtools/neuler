import {Icon, Loader} from "semantic-ui-react";
import React from "react";


export const LoadingIcon = ({steps, step, currentStep, currentStepFailed}) => {
    const currentIndex = steps.indexOf(currentStep)
    const stepIndex = steps.indexOf(step)

    if (step === currentStep) {
        return currentStepFailed ?
            <Icon size="big" name='close' color='red' className="loading-icon"/> :
            <Loader active inline className="loading-icon" size="large"/>;
    } else {
        if (stepIndex > currentIndex) {
            return <Icon size="big" name='question circle' color='grey' className="loading-icon"/>
        } else {
            return <Icon size="big" name='checkmark' color='green' className="loading-icon"/>
        }
    }
}

export const UserInputLoadingIcon = ({steps, step, currentStep, currentStepFailed, currentStepInProgress}) => {
    const currentIndex = steps.indexOf(currentStep)
    const stepIndex = steps.indexOf(step)

    if (step === currentStep) {
        if(currentStepInProgress) {
            return <Loader active inline className="loading-icon" size="large"/>;
        }

        return currentStepFailed ?
            <Icon size="big" name='close' color='red' className="loading-icon"/> :
            <Icon size="big" name='keyboard' color='red' className="loading-icon"/>;
    } else {
        if (stepIndex > currentIndex) {
            return <Icon size="big" name='question circle' color='grey' className="loading-icon"/>
        } else {
            return <Icon size="big" name='checkmark' color='green' className="loading-icon"/>
        }
    }
}