export const sampleGraphs = {
    "Game of Thrones": {
        name: "Game of Thrones",
        author: "Andrew Beveridge",
        authorLink: "https://networkofthrones.wordpress.com/",
        description: `A dataset containing interactions between the characters across the first 7 seasons of the popular TV show.`,
        queries: [
            `CREATE CONSTRAINT ON (c:Character) ASSERT c.id IS UNIQUE`,
            `UNWIND range(1,7) AS season
LOAD CSV WITH HEADERS FROM "https://github.com/neo4j-apps/neuler/raw/master/sample-data/got/got-s" + season + "-nodes.csv" AS row
MERGE (c:Character {id: row.Id})
ON CREATE SET c.name = row.Label`,
            `UNWIND range(1,7) AS season
LOAD CSV WITH HEADERS FROM "https://github.com/neo4j-apps/neuler/raw/master/sample-data/got/got-s" + season + "-edges.csv" AS row
MATCH (source:Character {id: row.Source})
MATCH (target:Character {id: row.Target})
CALL apoc.merge.relationship(source, "INTERACTS_SEASON" + season, {}, {}, target) YIELD rel
SET rel.weight = toInteger(row.Weight)`
        ],
        algorithms: [
            {
                name: "Page Rank",
                category: "Centralities",
                description: "Find the most influential characters in Westeros and elsewhere."
            },
            {
                name: "Shortest Path",
                category: "Path Finding",
                description: "Who can introduce Jon to Daenerys? Or Sansa to Drogo?"
            }
        ]
    },

    "European Roads": {
        name: "European Roads",
        author: "Lasse Westh-Nielsen",
        authorLink: "http://lassewesth.blogspot.com/2018/07/the-international-e-road-network-and.html",
        description: `A dataset containing European Roads.`,
        queries: [
            `CREATE CONSTRAINT ON (p:Place) ASSERT p.name IS UNIQUE`,
            `USING PERIODIC COMMIT 1000
LOAD CSV WITH HEADERS FROM "https://github.com/neo4j-apps/neuler/raw/master/sample-data/eroads/roads.csv"
AS row

MERGE (origin:Place {name: row.origin_reference_place})
SET origin.countryCode = row.origin_country_code

MERGE (destination:Place {name: row.destination_reference_place})
SET destination.countryCode = row.destination_country_code

MERGE (origin)-[eroad:EROAD {road_number: row.road_number}]->(destination)
SET eroad.distance = toInteger(row.distance), eroad.watercrossing = row.watercrossing`
        ],
        algorithms: [
            {
                name: "Degree",
                category: "Centralities",
                description: "Find the most connected cities on the continent."
            },
            {
                name: "All Pairs Shortest Path",
                category: "Path Finding",
                description: "What's the quickest route between the different European cities."
            }
        ]
    },
    "Twitter": {
        name: "Twitter",
        author: "Mark Needham",
        authorLink: "https://markhneedham.com/blog/",
        description: `A dataset containing Twitter followers of the graph community`,
        queries: [`CREATE CONSTRAINT ON(u:User) ASSERT u.id IS unique`,
            `CALL apoc.load.json("https://github.com/neo4j-apps/neuler/raw/master/sample-data/twitter/users.json")
YIELD value
MERGE (u:User {id: value.user.id })
SET u += value.user
FOREACH (following IN value.following |
  MERGE (f1:User {id: following})
  MERGE (u)-[:FOLLOWS]->(f1))
FOREACH (follower IN value.followers |
  MERGE(f2:User {id: follower})
  MERGE (u)<-[:FOLLOWS]-(f2));`
        ],
        algorithms: [
            {
                name: "Page Rank",
                category: "Centralities",
                description: "Find the most influential accounts in the Neo4j twittersphere."
            },
            {
                name: "Strongly Connected Components",
                category: "Community Detection",
                description: "Find groups of people that follow each other."
            }
        ]
    },

    "Recipes": {
        name: "Recipes",
        author: "DBpedia",
        authorLink: "https://wiki.dbpedia.org/",
        description: `A dataset containing recipes and their ingredients.`,
        queries: [
            `CREATE CONSTRAINT ON (r:Recipe) ASSERT r.name IS UNIQUE`,
            `CREATE CONSTRAINT ON (i:Ingredient) ASSERT i.name IS UNIQUE`,
            `USING PERIODIC COMMIT 1000
LOAD CSV WITH HEADERS FROM "https://github.com/neo4j-apps/neuler/raw/master/sample-data/recipes/recipes.csv"
AS row
MERGE (r:Recipe{name:row.recipe})
WITH r,row.ingredients as ingredients
UNWIND split(ingredients,',') as ingredient
MERGE (i:Ingredient{name:ingredient})
MERGE (r)-[:CONTAINS_INGREDIENT]->(i)`
        ],
        algorithms: [
            {
                name: "Degree",
                category: "Centralities",
                description: "Find the most used ingredients or most diverse recipes."
            },
            {
                name: "Jaccard",
                category: "Similarity",
                description: "Find the most similar recipes."
            }
        ]
    },
    "FIFA": {
        name: "FIFA",
        author: "Aman Shrivastava",
        authorLink: "https://github.com/4m4n5",
        description: `A dataset of FIFA players and their rankings.`,
        queries: [
            `CREATE CONSTRAINT ON (p:Player) ASSERT p.name IS UNIQUE`,
            `USING PERIODIC COMMIT 500
load csv with headers from "https://github.com/4m4n5/fifa18-all-player-statistics/raw/master/2019/data.csv" AS row
MERGE (p:Player {name: row.Name})
SET p.crossing = toInteger(row.Crossing),
    p.finishing = toInteger(row.Finishing),
    p.headingAccuracy = toInteger(row.\`HeadingAccuracy\`),
    p.shortPassing = toInteger(row.\`ShortPassing\`),
    p.volleys = toInteger(row.\`Volleys\`),
    
    p.dribbling = toInteger(row.\`Dribbling\`),
    p.curve = toInteger(row.\`Curve\`),
    p.fkAccuracy = toInteger(row.\`FK Accuracy\`),
    p.longPassing = toInteger(row.\`LongPassing\`),
    p.ballControl = toInteger(row.\`BallControl\`),
    
    p.acceleration = toInteger(row.\`Acceleration\`),
    p.sprintSpeed = toInteger(row.\`SprintSpeed\`),
    p.agility = toInteger(row.\`Agility\`),
    p.reactions = toInteger(row.\`Reactions\`),
    p.balance = toInteger(row.\`Balance\`),
    
    p.shotPower = toInteger(row.\`ShotPower\`),
    p.jumping = toInteger(row.\`Jumping\`),
    p.stamina = toInteger(row.\`Stamina\`),
    p.strength = toInteger(row.\`Strength\`),
    p.longShots = toInteger(row.\`LongShots\`),
    
    p.standingTackle = toInteger(row.\`StandingTackle\`),
    p.gkHandling = toInteger(row.\`GKHandling\`),
    p.gkPositioning = toInteger(row.\`GKPositioning\`),
    p.penalties = toInteger(row.\`Penalties\`),
    p.aggression = toInteger(row.\`Aggression\`),
    
    p.overall = toInteger(row.\`Overall\`),
    
    p.position = row.\`Position\`,
    p.value = row.\`Value\``,
`MATCH (p:Player)
SET p.embedding = [key in keys(p) 
                   WHERE not(key IN ["name", "position", "value", "overall"]) 
                   AND apoc.meta.cypher.type(p[key]) = "INTEGER"
                   | p[key]]`,
`match (p:Player)
WHERE size(p.embedding) = 0
DELETE p`
        ],
        algorithms: [
            {
                name: "Degree",
                category: "Centralities",
                description: "Find the most used ingredients or most diverse recipes."
            },
            {
                name: "Jaccard",
                category: "Similarity",
                description: "Find the most similar recipes."
            }
        ]
    }

}
