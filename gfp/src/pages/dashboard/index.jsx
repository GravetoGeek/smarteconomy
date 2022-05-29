import React, { useState } from "react";
import { Box, Button, Center,Text, VStack } from "native-base";
import { Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";



export default function Dashboard(){
  const [date, setDate] = useState(new Date(1598051730000));
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate
    setDate(currentDate);
  }
  
  const showMode = (currentMode)=>{
    DateTimePickerAndroid.open({
      value: date,
      onChange,
      mode:currentMode,
      is24Hour: true,
    });
  }

  const showDatepicker = () => {
    showMode('date');
  }
  const showTimepicker = () => {
    showMode('time');
  }
  const data ={
    labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun","Jul", "Ago", "Set", "Out", "Nov", "Dez"],
    datasets: [
      {
        data: [
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
        ],
        strokeWidth: 2,
								color: (opacity = 1) => `rgba(255,0,0,${opacity})`, // optional
                stroke: "#7f0000",
      },
      {
        data: [
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
        ],
        strokeWidth: 2,
								color: (opacity = 1) => `rgba(0,255,0, ${opacity})`, // optional
                stroke: "#427f00",
      },
    ],
  }
  
  const chartConfig ={
    backgroundColor: "#dd04f5",
    backgroundGradientFrom: "#f6a3ff",
    backgroundGradientTo: "#f6a3ff",
    decimalPlaces: 2, // optional, defaults to 2dp
    horizontalLabelRotation:90,
    verticalLabelRotation:90,
    color: (opacity = 1) => `rgba(150, 150, 150, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "4",
      strokeWidth: "2",
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
        <Button onPress={showDatepicker} color="white" title="Show date picker!"/>
        <Button onPress={showTimepicker} title="Show time picker!"/>
        <Text>selected: {date.toLocaleString()}</Text>
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