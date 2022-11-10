import React from "react";

const baseRecipes = {
    "directed-graph-influencers": {
        name: "Directed Graph Influencers",
        shortDescription: "This recipe contains algorithms that find the most influential nodes in a directed graph.",
        completionMessage: "You should now have a good idea about how to find the most influential or central nodes in your graph.",
        slides: [
            {
                group: "Centralities",
                algorithm: "Degree",
                title: "Degree Centrality",
                overrides: {formParameters: {}},
                description: <React.Fragment>
                    <p>
                        Degree Centrality finds the most influential or central nodes in a graph based on the
                        number of relationships that the node has.
                    </p>
                    <p>
                        By default, it counts the number of incoming relationships but this value can be
                        configured via the <i>Relationship Orientation</i> parameter.
                    </p>
                    <p>
                        The weighted degree centrality for each node is computed by providing an optional
                        relationship property name via the <i>Weight Property</i> parameter.
                    </p>
                </React.Fragment>
            },
            {
                group: "Centralities",
                algorithm: "Page Rank",
                title: "Page Rank",
                overrides: {formParameters: {}},
                description: <React.Fragment>
                    <p>
                        Page Rank finds the nodes that have the great transitive influence.
                    </p>
                    <p>
                        This means that it's not only how many incoming relationships that matters, it's also the
                        importance of the nodes on the other side of that relationship.
                    </p>
                </React.Fragment>
            },
            {
                group: "Centralities",
                algorithm: "Betweenness",
                title: "Betweenness Centrality",
                overrides: {formParameters: {}},
                description: <React.Fragment>
                    <p>
                        The Betweenness Centrality algorithm detects the amount of influence a node has over the
                        flow of
                        information in a graph.
                    </p>
                    <p>
                        It is often used to find nodes that serve as a bridge from one part of a graph to another.
                    </p>
                    <p>
                        We can use this algorithm to find nodes that are well connected to a sub graph within the
                        larger
                        graph.
                    </p>
                </React.Fragment>
            }
        ]
    },
    "community-detection": {
        name: "Community Detection on Multi Partite Graph",
        shortDescription: "This recipe contains a sequence of algorithms for detecting communities in a multi partite (more than 1 label) graph.",
        completionMessage: "You should now understand how to find communities in a graph containing multiple labels",
        slides: [
            {
                group: "Similarity",
                algorithm: "Node Similarity",
                title: "Jaccard Similarity",
                overrides: {
                    formParameters: {persist: true},
                    parameters: {config: {}},
                    formParametersToPassOn: [
                        {source: "writeRelationshipType", target: "relationshipType"},
                        {source: "writeProperty", target: "weightProperty"},
                        {source: "label", target: "label"}
                    ],
                    slidesToUpdate: [1]
                },
                description: <React.Fragment>
                    <p>
                        The Jaccard or Node similarity algorithm computes the similarity of pairs of nodes based on
                        the
                        nodes that they're connected to.
                    </p>

                    <p>
                        We can use this algorithm to create a similarity graph by setting <i>Store results?</i> and
                        specifying <i>Write Property</i> and <i>Write Relationship Type</i>.
                    </p>

                    <p>
                        This technique is useful for creating relationships between nodes where none exist in the
                        initial graph. e.g. we could create relationships between <i>Recipe</i> nodes based on
                        the <i>Ingredient</i> nodes that they have in common.
                    </p>


                </React.Fragment>
            },
            {
                group: "Community Detection",
                algorithm: "Label Propagation",
                title: "Label Propagation",
                overrides: {formParameters: {}, parameters: {config: {}}},
                description: <React.Fragment>
                    <p>
                        The Label Propagation Algorithm is a fast algorithm for finding communities in a graph,
                        which it
                        does by propagating labels and forming communities based on this process of label
                        propagation
                    </p>

                    <p>
                        On initialisation, every node has its own label, but as labels propagate, densely connected
                        groups of nodes quickly reach a consensus on a unique label. At the end of the propagation
                        only
                        a few labels will remain.
                    </p>

                </React.Fragment>
            }
        ]
    }

};


export const recipes = (gdsVersion) => {
    const version = parseInt(gdsVersion.split(".")[0])
    if (version >= 2) {
        baseRecipes["categorise-unstructured-data"] = {
            name: "Categorise Unstructured Data",
            shortDescription: "This recipe contains a sequence of algorithms for creating a graph structure based on node property similarities.",
            completionMessage: "You should now understand how to find build a graph from unstructured data.",
            slides: [
                {
                    group: "Similarity",
                    algorithm: "K-Nearest Neighbors",
                    title: "K-Nearest Neighbors",
                    overrides: {
                        formParameters: {persist: true},
                        parameters: {config: {}},
                        formParametersToPassOn: [
                            {source: "writeRelationshipType", target: "relationshipType"},
                            {source: "writeProperty", target: "weightProperty"},
                            {source: "label", target: "label"}
                        ],
                        slidesToUpdate: [1,2]
                    },
                    description: <React.Fragment>
                        <p>
                            The K-Nearest Neighbors algorithm computes a distance value for all node pairs in the graph and creates new relationships between each node and its k nearest neighbors.
                            The distance is calculated based on node properties.
                        </p>


                    </React.Fragment>
                },
                {
                    group: "Community Detection",
                    algorithm: "Louvain",
                    title: "Louvain",
                    overrides: {formParameters: {}, parameters: {config: {}}},
                    description: <React.Fragment>
                        <p>
                            The Louvain method for community detection is an algorithm for detecting communities in networks.
                            It maximizes a modularity score for each community, where the modularity quantifies the quality of an assignment of nodes to communities.
                        </p>

                    </React.Fragment>
                },
                {
                    group: "Community Detection",
                    algorithm: "Label Propagation",
                    title: "Label Propagation",
                    overrides: {formParameters: {}, parameters: {config: {}}},
                    description: <React.Fragment>
                        <p>
                            The Label Propagation Algorithm is a fast algorithm for finding communities in a graph,
                            which it
                            does by propagating labels and forming communities based on this process of label
                            propagation
                        </p>

                        <p>
                            On initialisation, every node has its own label, but as labels propagate, densely connected
                            groups of nodes quickly reach a consensus on a unique label. At the end of the propagation
                            only
                            a few labels will remain.
                        </p>

                    </React.Fragment>
                }
            ]
        }
        return baseRecipes
    } else {
        return baseRecipes
    }
}
