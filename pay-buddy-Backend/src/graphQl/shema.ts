import {gql} from 'apollo-server-express';

export const typeDefs = gql`
 type Authentication {
    password: String!
    salt: String!
    sessionToken: String!

 }

 type Transaction {
    items: [TransItems]
 }
 type Activity {
    records: [ActivityItem]
}

 type TransItems {
    T_id: String
    Tname: String
    Tpayername: String
    Temail: String
    Tamount: Float
    Tdescription: String
    status: String
    Timedate: String
    verificationCode: String
 }
 type ActivityItem {
    id: ID!
    msg: String
 }
 type User {
    _id: ID!
    name: String!
    email: String!
    authentication: Authentication!
    transaction: Transaction
    activity: Activity
 }
 type Query {
    getUserbyId(_id: ID!): User
    getUserbyEmail(email: String!): User
    getUser(email: String!): User
    getUserById(id: ID!): User
    getUserByEmail(email: String!): User
    getUserBySessionToken: User  
    getTempDataTwo: Transaction
    getCount: Int
    getAllActivity: [ActivityItem]
   
 }
 type Mutation {
    register(name: String!, email: String!, password: String!): User
    login(email: String!, password: String!): String
    deleteUser(id: ID!): User
    updateUser(id: ID!, name: String!): User
    updatePassword(token: String!, password: String!): User
    forgottenPass(email: String!): Boolean
    updateStatusR(newStatus: String!, tid: String!): User
    deleteTempData: Boolean
    insertNewTransaction(tdata: TransactionInput!): Boolean
    deleteTransactation(tid: String!): Boolean
    addActivity(activityWatcher: String!, currentTimestamp: ID!): Boolean
    deleteOneActivity(tid: ID!): Boolean
    deleteAllActivity: Boolean
    sendverificationCode(tid: String): Boolean
    sendVerificationCode_Client(token: String! ,tid: Int!, status: String!): Boolean
    logout: Boolean
  }
  input TransactionInput {
    title: String!
    payerName: String!
    email: String!
    amountToBePaid: Float!
    description: String!
  }
` 