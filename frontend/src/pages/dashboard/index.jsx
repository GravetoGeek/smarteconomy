import React, { useState, useEffect } from "react";
import { Box, Button, Center,Text, VStack } from "native-base";
import { Dimensions } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { BACKEND_HOST, BACKEND_PORT } from "react-native-dotenv";
import axios from "axios";


const URL = `http://${BACKEND_HOST}:${BACKEND_PORT}/transaction`;

export default function Dashboard(){
  const [data, setData] = useState([])

  useEffect(() => {
    fetchData();
    }, []
  );
  
  const fetchData = async () => {
    try{
      const response = await axios.get(URL);
      console.log(response.data)
      setData(response.data);
    }catch(error){
      console.error(error);
    }
  }

  const width=Dimensions.get("window").width;
  const height=200;
  return(
    <Box height="full">
      <VStack width="full">
        <Text color={'orange.600'} bold textAlign={'center'}>Balanço</Text>
        <Center>
        <PieChart
        data={data}
        width={width*0.95}
        height={height}
        chartConfig={{
          backgroundColor: '#1cc910',
          backgroundGradientFrom: '#eff3ff',
          backgroundGradientTo: '#efefef',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
        accessor="type"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
        />
        </Center>
      </VStack>
    </Box>
  ) 
}