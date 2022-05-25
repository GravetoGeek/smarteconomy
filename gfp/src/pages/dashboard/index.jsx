import React from "react";
import { Box, Center,Text, VStack } from "native-base";

import { Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";



export default function Dashboard(){
  const data ={
    labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
    datasets: [
      {
        data: [
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
        ],
      },
    ],
  }
  
  const chartConfig ={
    backgroundColor: "#dc7be5",
    backgroundGradientFrom: "#fbcfe8",
    backgroundGradientTo: "#f9a8d4",
    decimalPlaces: 2, // optional, defaults to 2dp
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: "#7f004a",
    },
  }

  const graphStyle={
    marginVertical: 8,
    borderRadius: 16,
  }
  const width=Dimensions.get("window").width;
  const height=200;
  const bezier = true
  return(
    <Box height="full">
      <VStack width="full">
        <Text color={'orange.600'} bold textAlign={'center'}>Balanço</Text>
        <Center>
        <LineChart
        data={data}
        width={width*0.95}
        yAxisLabel="R$"
    yAxisSuffix=""
        height={height}
        bezier={bezier}
        style={graphStyle}
        chartConfig={chartConfig}/>
        </Center>
      </VStack>
    </Box>
  ) 
}