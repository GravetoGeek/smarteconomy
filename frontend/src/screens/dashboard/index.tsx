import { BACKEND_HOST, BACKEND_PORT } from "@env";
import axios from "axios";
import { Box, Center, Text, VStack } from "native-base";
import React, { useEffect, useState } from "react";
import { Dimensions } from "react-native";
import { PieChart } from "react-native-chart-kit";
import Header from "../../components/Header";


const URL = `http://${BACKEND_HOST}:${BACKEND_PORT}/dashboard/despesasporcategorias`;

export default function Dashboard() {
  const [data, setData] = useState([])
  const categoryColors = {
    "Alimentação": { "color": "#ff0000", "legendFontColor": "#ffffff", "legendFontSize": 15 },
    "Educação": { "color": "#00ff4c", "legendFontColor": "#ffffff", "legendFontSize": 15 },
    "Lazer": { "color": "#00ffea", "legendFontColor": "#ffffff", "legendFontSize": 15 },
    "Moradia": { "color": "#ff8800", "legendFontColor": "#ffffff", "legendFontSize": 15 },
    "Saúde": { "color": "#00a2ff", "legendFontColor": "#ffffff", "legendFontSize": 15 },
    "Transporte": { "color": "#ff00c8", "legendFontColor": "#ffffff", "legendFontSize": 15 },
    "Outros": { "color": "#4b4b4b", "legendFontColor": "#ffffff", "legendFontSize": 15 }
  }

  useEffect(() => {
    fetchData();
  }, []
  );

  const fetchData = async () => {
    try {
      let data = new Date()
      let startDate = new Date(data.getFullYear(), data.getMonth(), 1).toISOString().slice(0, 10)
      let endDate = new Date(data.getFullYear(), data.getMonth() + 1, 0).toISOString().slice(0, 10)
      console.log("startDate", startDate)
      console.log("endDate", endDate)
      const response = await axios.post(URL, {
        "profileId": 85,
        "startDate": startDate,
        "endDate": endDate
      },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      ).then((response) => {
        return response.data.map((item: { category: string | number; amount: any; color: string; legendFontColor: string; legendFontSize: number }) => { return { name: item.category, amount: item.amount, ...categoryColors[item.category] } })
      })
      console.log("response", response)
      setData(response);

    } catch (error) {
      console.error(error);
    }
  }

  const width = Dimensions.get("window").width;
  const height = Dimensions.get("window").height * 0.35;
  return (
    <Box height="full">
      <VStack width="full">
        <Header />
        <Text color={'orange.600'} bold textAlign={'center'}>Despesa mensal por categoria</Text>
        <Center>

          <PieChart
            data={data}
            width={width}
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
              borderRadius: 16,
              marginTop: 10,
            }}
            accessor={"amount"}
            backgroundColor={"#A332B3"}
            paddingLeft={"0"}
            hasLegend={true}
          />
        </Center>
      </VStack>
    </Box>
  )
}