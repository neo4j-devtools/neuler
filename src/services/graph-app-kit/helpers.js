export const getActiveProject = (context = {}) => {
    if (!context) return null;
    const { projects } = context;
    if (!Array.isArray(projects)) return null;
    const activeProject = projects.find(project => {
      if (!project) return false;
      if (!(project.graphs && Array.isArray(project.graphs))) return false;
      return project.graphs.find(({ status }) => status === "ACTIVE");
    });
    return activeProject || null;
  };

export const getCredentials = (type, connection) => {
  if (!connection) return null;
  const { configuration = null } = connection;
  if (
    !(
      configuration &&
      configuration.constructor &&
      configuration.constructor === Object
    )
  ) {
    return null;
  }
  if (
    !(
      configuration.protocols &&
      configuration.protocols.constructor &&
      configuration.protocols.constructor === Object
    )
  ) {
    return null;
  }
  if (typeof configuration.protocols[type] === "undefined") {
    return null;
  }
  return configuration.protocols[type];
};

export const getActiveGraph = (context = {}) => {
  const activeProject = getActiveProject(context);
  if (!activeProject) return null;
  return activeProject.graphs.find(({ status }) => status === "ACTIVE");
};

export const getActiveCredentials = (type, context) => {
  const activeGraph = getActiveGraph(context);
  if (!activeGraph || typeof activeGraph.connection === "undefined")
    return null;
  const creds = getCredentials(type, activeGraph.connection);
  return creds || null;
};

export const getActiveDatabaseCredentials = (context) => {
  const creds = getActiveCredentials("bolt", context);
  if (creds) {
    return {
      host: creds.url || `bolt://${creds.host}:${creds.port}`,
      encrypted: creds.tlsLevel === "REQUIRED",
      username: creds.username,
      password: creds.password,
    };
  } else {
    return null;
  }
};

export const subscribeToDatabaseCredentialsForActiveGraph = (
  integrationPoint,
  onNewActiveGraph,
  onNoActiveGraph
) => {
  if (integrationPoint && integrationPoint.getContext) {
    integrationPoint
      .getContext()
      .then((context) => {
        const credentials = getActiveDatabaseCredentials(context);
        const activeProject = getActiveProject(context);
        const activeGraph = getActiveGraph(context);
        if (credentials) {
          onNewActiveGraph(
            credentials,
            { name: activeProject.name, id: activeProject.id },
            {
              name: activeGraph.name,
              id: activeGraph.id,
              description: activeGraph.description,
            }
          );
        } else {
          onNoActiveGraph();
        }
      })
      .catch((e) => {}); // Catch but don't bother
    integrationPoint.onContextUpdate((event, newContext, oldContext) => {
      switch (event.type) {
        case "GRAPH_ACTIVE":
          const credentials = getActiveDatabaseCredentials(newContext);
          const activeProject = getActiveProject(newContext);
          const activeGraph = getActiveGraph(newContext);
          if (credentials) {
            onNewActiveGraph(
              credentials,
              { name: activeProject.name, id: activeProject.id },
              {
                name: activeGraph.name,
                id: activeGraph.id,
                description: activeGraph.description,
              }
            );
          } else {
            onNoActiveGraph();
          }
          break;
        case "GRAPH_INACTIVE":
          onNoActiveGraph();
          break;
        default:
          break;
      }
    });
  }
};
