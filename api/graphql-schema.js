const neo4jgraphql = require('neo4j-graphql-js');

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = `
  type Movie {
    id: String
    imdbID: String
    plot: String
    posterURL: String
    title: String
    tmdbID: String
    imdbRating: String
    metacriticRating: String
    rottenTomatoesRating: String
    actors: [Person] @relation(name: "ACTED_IN", direction: "IN")
    recent: [Movie] @cypher(statement: "MATCH (m:Movie)-[:FROM_YEAR]-(year) WHERE year.year STARTS WITH '2' RETURN m ORDER BY year.year DESC LIMIT 15")
    popular: [Movie] @cypher(statement: "MATCH (m:Movie) WHERE EXISTS(m.imdbRating) WITH m AS pop, m.imdbRating AS rating ORDER BY rating DESC RETURN pop LIMIT 15")
    similar: [Movie] @cypher(statement:
      """
        MATCH (m1:Movie {title: this.title}),
          (m1)-[:HAS_GENRE]->(genre)<-[:HAS_GENRE]-(m2),
          (m1)<-[:ACTED_IN|:DIRECTED]-(person)-[:ACTED_IN|:DIRECTED]->(m2),
          (m1)-[:FROM_YEAR]->(year1),
          (m2)-[:FROM_YEAR]->(year2)
        OPTIONAL MATCH (m1)-[:HAS_RATING]->(rating)<-[:HAS_RATING]-(m2)
        WITH m2 AS reco,
          COUNT(DISTINCT genre) AS genresInCommon, 
          COUNT(DISTINCT person) AS peopleInCommon,
          COUNT(DISTINCT rating) AS ratingsInCommon,
          abs(toInteger(year1.year) - toInteger(year2.year)) AS yearDiff,
          size([x IN split(m1.title, ' ') WHERE x IN split(m2.title, ' ') AND NOT toLower(x) IN [
            'a', 'about', 'above', 'above', 'across', 'after', 'afterwards', 'again', 'against',
            'all', 'almost', 'alone', 'along', 'already', 'also','although','always','am','among', 
            'amongst', 'amoungst', 'amount',  'an', 'and', 'another', 'any','anyhow','anyone',
            'anything','anyway', 'anywhere', 'are', 'around', 'as',  'at', 'back','be','became', 
            'because','become','becomes', 'becoming', 'been', 'before', 'beforehand', 'behind', 
            'being', 'below', 'beside', 'besides', 'between', 'beyond', 'bill', 'both', 'bottom',
            'but', 'by', 'call', 'can', 'cannot', 'cant', 'co', 'con', 'could', 'couldnt', 'cry', 
            'de', 'describe', 'detail', 'do', 'done', 'down', 'due', 'during', 'each', 'eg', 
            'eight', 'either', 'eleven','else', 'elsewhere', 'empty', 'enough', 'etc', 'even', 
            'ever', 'every', 'everyone', 'everything', 'everywhere', 'except', 'few', 'fifteen', 
            'fify', 'fill', 'find', 'fire', 'first', 'five', 'for', 'former', 'formerly', 'forty', 
            'found', 'four', 'from', 'front', 'full', 'further', 'get', 'give', 'go', 'had', 'has', 
            'hasnt', 'have', 'he', 'hence', 'her', 'here', 'hereafter', 'hereby', 'herein', 'hereupon', 
            'hers', 'herself', 'him', 'himself', 'his', 'how', 'however', 'hundred', 'ie', 'if', 'in', 
            'inc', 'indeed', 'interest', 'into', 'is', 'it', 'its', 'itself', 'keep', 'last', 'latter', 
            'latterly', 'least', 'less', 'ltd', 'made', 'many', 'may', 'me', 'meanwhile', 'might', 
            'mill', 'mine', 'more', 'moreover', 'most', 'mostly', 'move', 'much', 'must', 'my', 'myself', 
            'name', 'namely', 'neither', 'never', 'nevertheless', 'next', 'nine', 'no', 'nobody', 'none', 
            'noone', 'nor', 'not', 'nothing', 'now', 'nowhere', 'of', 'off', 'often', 'on', 'once', 'one', 
            'only', 'onto', 'or', 'other', 'others', 'otherwise', 'our', 'ours', 'ourselves', 'out', 
            'over', 'own','part', 'per', 'perhaps', 'please', 'put', 'rather', 're', 'same', 'see', 
            'seem', 'seemed', 'seeming', 'seems', 'serious', 'several', 'she', 'should', 'show', 'side', 
            'since', 'sincere', 'six', 'sixty', 'so', 'some', 'somehow', 'someone', 'something', 
            'sometime', 'sometimes', 'somewhere', 'still', 'such', 'system', 'take', 'ten', 'than', 
            'that', 'the', 'their', 'them', 'themselves', 'then', 'thence', 'there', 'thereafter', 
            'thereby', 'therefore', 'therein', 'thereupon', 'these', 'they', 'thick', 'thin', 'third', 
            'this', 'those', 'though', 'three', 'through', 'throughout', 'thru', 'thus', 'to', 'together', 
            'too', 'top', 'toward', 'towards', 'twelve', 'twenty', 'two', 'un', 'under', 'until', 'up', 
            'upon', 'us', 'very', 'via', 'was', 'we', 'well', 'were', 'what', 'whatever', 'when', 'whence', 
            'whenever', 'where', 'whereafter', 'whereas', 'whereby', 'wherein', 'whereupon', 'wherever', 
            'whether', 'which', 'while', 'whither', 'who', 'whoever', 'whole', 'whom', 'whose', 'why', 'will', 
            'with', 'within', 'without', 'would', 'yet', 'you', 'your', 'yours', 'yourself', 'yourselves', 'the']]
          ) AS titleInCommon
        ORDER BY (genresInCommon + peopleInCommon + ratingsInCommon + titleInCommon - (yearDiff*0.25)) DESC
        RETURN reco
        LIMIT 15
      """)
  }

  type Person {
    name: String
    moviesActedIn: [Movie] @relation(name: "ACTED_IN", direction: "OUT")
    moviesDirected: [Movie] @relation(name: "DIRECTED", direction: "OUT")
  }

  type Genre {
    name: String
  }

  type Rating {
    name: String
  }

  type Year {
    year: String
  }

  type User {
    id: String
    recomended: [Movie] @cypher(statement: 
      """
        MATCH (u:User {id: this.id})-[r:RATED]->(m1)
        WITH u, m1, r ORDER BY r.rating DESC LIMIT 5
        MATCH (m1)-[:HAS_GENRE]->(g:Genre),
          (m1)<-[:ACTED_IN|:DIRECTED]-(p:Person),
          (m1)-[:HAS_RATING]->(ra:Rating),
          (m2)-[:HAS_GENRE]->(g),
          (m2)<-[:ACTED_IN|:DIRECTED]-(p),
          (m2)-[:HAS_RATING]->(ra)
        WHERE NOT (u)-[:RATED]->(m2)
        WITH m2 AS reco, 
          COUNT(DISTINCT g) AS numGenresInCommon,
          COUNT(DISTINCT p) AS numPeopleInCommon,
          COUNT(DISTINCT ra) AS ratingsInCommon
        ORDER BY (numGenresInCommon + numPeopleInCommon + ratingsInCommon) DESC
        RETURN reco
        LIMIT 15
      """)
  }

  type Query {
    movies: [Movie]
    people: [Person]
    genres: [Genre]
    ratings: [Rating]
    years: [Year]
    users: [User]
  }
`;

// Resolvers define the technique for fetching the types in the
const resolvers = {
  Query: {
    movies: neo4jgraphql,
    people: neo4jgraphql,
    genres: neo4jgraphql,
    ratings: neo4jgraphql,
    years: neo4jgraphql,
    users: neo4jgraphql
  },
};

module.exports = { typeDefs, resolvers }