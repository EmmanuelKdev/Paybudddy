import { createAsyncThunk } from '@reduxjs/toolkit';
import { gql } from '@apollo/client';
import client  from '../../ApolloClientSetUp'

// Define the GraphQL query
const GET_TEMP_DATA_TWO = gql`
  query GetTempDataTwo {
    getTempDataTwo {
      items {
        T_id
        Tname
        Tpayername
        Temail
        Tamount
        Tdescription
        status
        Timedate
      }
    }
  }
`;

// Create an async thunk for fetching data from the API
export const fetchData = createAsyncThunk('data/fetchData', async () => {
  const response = await client.query({ query: GET_TEMP_DATA_TWO });
  return response.data.getTempDataTwo.items;
});