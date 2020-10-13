import {v4 as generateTaskId} from "uuid";
import {getActiveDatabase} from "../services/stores/neoStore";
import {ADDED} from "../ducks/tasks";
import {sendMetrics} from "../components/metrics/sendMetrics";
import {constructQueries} from "../components/CodeView";
import {getAlgorithmDefinitions} from "../components/algorithmsLibrary";

export const constructNewTask = (group, algorithm, limit, communityNodeLimit, gdsVersion) => {
    const taskId = generateTaskId()
    const addLimits = (params) => {
        return {
            ...params,
            limit: limit,
            communityNodeLimit: communityNodeLimit
        }
    }
    const {parameters, parametersBuilder} = getAlgorithmDefinitions(group, algorithm, gdsVersion)

    const params = parametersBuilder({
        ...parameters,
        requiredProperties: Object.keys(parameters)
    })

    const formParameters = addLimits(parameters);

    return {
        group: group,
        algorithm: algorithm,
        taskId,
        parameters: params,
        formParameters,
        persisted: parameters.persist,
        startTime: new Date(),
        database: getActiveDatabase(),
        status: ADDED
    }
}

export const onRunAlgo = (task, parameters, formParameters, persisted, versions, completeTask, onComplete, runTask) => {
    const {taskId, group, algorithm} = task
    const algorithmDefinition = getAlgorithmDefinitions(group, algorithm, versions.gdsVersion);
    const {service, getFetchQuery} = algorithmDefinition

    let fetchCypher

    let streamQuery = algorithmDefinition.streamQuery
    let storeQuery = algorithmDefinition.storeQuery

    if (group === "Similarity") {
        const {itemLabel, relationshipType, categoryLabel, weightProperty} = parameters
        streamQuery = streamQuery(itemLabel, relationshipType, categoryLabel, weightProperty)
        storeQuery = storeQuery(itemLabel, relationshipType, categoryLabel, weightProperty)

        fetchCypher = getFetchQuery(itemLabel, parameters.config.writeRelationshipType, parameters.config)
        delete parameters.itemLabel
        delete parameters.relationshipType
        delete parameters.categoryLabel
    } else {
        fetchCypher = getFetchQuery(parameters.label, parameters.config)
    }

    const serviceParameters = {
        streamCypher: streamQuery,
        storeCypher: storeQuery,
        fetchCypher,
        parameters,
        persisted
    };

    const params = { ...versions, taskId, algorithm, group}

    sendMetrics('neuler-call-algorithm', algorithm, params)

    service(serviceParameters).then(result => {
        // sendMetrics('neuler', "completed-algorithm-call", params)
        completeTask(taskId, result)
        if (persisted) {
            onComplete()
        }
    }).catch(exc => {
        console.log('ERROR IN SERVICE', exc)
        completeTask(taskId, [], exc.toString())
    })

    const constructedQueries = constructQueries(algorithmDefinition, parameters, streamQuery)

    runTask(
        taskId,
        persisted ? [storeQuery, fetchCypher] : [streamQuery],
        persisted ?
            [constructedQueries.createGraph, constructedQueries.storeAlgorithmNamedGraph, fetchCypher, constructedQueries.dropGraph] :
            [constructedQueries.createGraph, constructedQueries.streamAlgorithmNamedGraph, constructedQueries.dropGraph],
        parameters,
        formParameters,
        persisted
    )
}
