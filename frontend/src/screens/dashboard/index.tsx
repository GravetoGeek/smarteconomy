import { BACKEND_HOST, BACKEND_PORT } from "@env";
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Box, Center, FlatList, HStack, Icon, Modal, ScrollView, Text, VStack, View } from "native-base";
import React, { Children, useContext, useEffect, useRef, useState } from "react";
import { Animated, Dimensions, TouchableOpacity } from "react-native";
import Svg from "react-native-svg";
import { VictoryChart, VictoryLabel, VictoryLegend, VictoryPie } from 'victory-native';
import CircleButton from "../../components/CircleButton";
import Balance from "../../components/Dashboard/balance";
import FloatingBottomMenu from "../../components/FloatingBottomMenu";
import Header from "../../components/Header";
import IconButton from "../../components/IconButton";
import { Store } from '../../contexts/StoreProvider';
import { styles } from "./style";

interface ApiData {
  amount: number;
  category: string;
}

interface Data {
  x: string;
  y: number;
  color: string;
  iconName: string;
}

export default function Dashboard() {
  const { user, setUser, token, setToken, profile, setProfile, startDate, endDate } = useContext(Store);
  const [apiData, setApiData] = useState<ApiData[]>([]);
  const [gastoTotal, setGastoTotal] = useState(0);


  const navigation = useNavigation();

  const handleNavigateAddTransaction = () => {
    navigation.navigate('AddTransaction');
  }
  const handleNavigateAddAccount = () => {
    navigation.navigate('AddAccount');
  }
  const handleNavigateManageProfile = () => {
    navigation.navigate('ManageProfile');
  }

  const moeda = Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  // const moeda = Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' });

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );


  // useEffect(() => {
  //   fetchData();
  // }, []);

  const fetchData = async () => {
    try {
      let data = new Date();
      // let startDate = new Date(data.getFullYear(), data.getMonth(), 1).toISOString().slice(0, 10);
      // let endDate = new Date(data.getFullYear(), data.getMonth() + 1, 0).toISOString().slice(0, 10);

      //Buscar Perfil do usuário
      const profileResponse = await fetch(`http://${BACKEND_HOST}:${BACKEND_PORT}/profile/byUser/${user.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token.access_token}`
        },
      })
        .then((response) => response.json())
      // console.log('profileResponse', profileResponse)
      setProfile({ ...profileResponse });

      if (profileResponse.name == null || profileResponse.birthday == null || profileResponse.lastname == null || profileResponse.monthly_income == null || profileResponse.gender_id == null || profileResponse.profession == null) {
        handleNavigateManageProfile()
      }

      // console.log('profile', profile)

      // Buscar contas do usuário
      const accountResponse = await fetch(`http://${BACKEND_HOST}:${BACKEND_PORT}/account/byProfile/${profileResponse.id || profile.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token.access_token}`
        },
      })
        .then((response) => response.json())

      // console.log('accountResponse', accountResponse)
      if (accountResponse.status == 404) {
        handleNavigateAddAccount()
      }

      let payload = {
        "profileId": profileResponse.id || profile.id,
        "startDate": startDate,
        "endDate": endDate
      }

      console.log('payload', payload)
      // Buscar transações do usuário por categoria em um determinado período
      const response = await fetch(`http://${BACKEND_HOST}:${BACKEND_PORT}/dashboard/despesasporcategorias`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }).then((response) => response.json())


      if (response.length === 0) {
        // handleNavigateAddTransaction()
      }

      if (response.length !== 0) {
        let countGastoMensal = 0;
        // console.log('response', response)
        response.forEach((item: ApiData) => {
          countGastoMensal += item.amount;
        });
        setGastoTotal(countGastoMensal);

        setApiData(response);
      }



    } catch (error) {
      console.error(error);
    }
  };

  const getCategoryIcon = (categoryName: string): string => {
    switch (categoryName) {
      case "Lazer":
        return "local-activity";
      case "Educação":
        return "school";
      case "Saúde":
        return "local-hospital";
      case "Transporte":
        return "directions-car";
      case "Outros":
        return "category";
      case "Moradia":
        return "home";
      case "Alimentação":
        return "restaurant";
      default:
        return "help";
    }
  };


  const cores = ['#FFA726', '#66BB6A', '#42A5F5', '#EF5350', '#AB47BC', '#FF7043', '#26C6DA', '#FFEE58', '#FFA726', '#66BB6A', '#42A5F5', '#EF5350', '#AB47BC', '#FF7043', '#26C6DA', '#f0ad4e', '#5cb85c', '#5bc0de', '#d9534f'];


  let chartData: Data[] = apiData.map((item, index) => ({
    x: item.category,
    y: item.amount,
    color: cores[index],
    iconName: getCategoryIcon(item.category),
  }));

  if (chartData.length === 0) {
    chartData = [{
      x: 'Sem despesas',
      y: 0.001,
      color: '#a4a3a3',
      iconName: 'help',
    }]
  }



  const CategoryIcon = (props: any) => {
    return <Icon
      as={<MaterialIcons name={props.iconName} color={props.color} />}
      size={5}
      ml={2}
      color="muted.400"
    />

  };


  return (
    <Box flex={1} bg="white">
      <Header />
      <VStack width="full">

        <ScrollView>
          <Balance />
          <Box width="full" mt={1} mb={1}>
            <Text color={'orange.600'} bold textAlign={'center'}>Despesa por categoria</Text>

            {/* <Svg width="100%" viewBox="0 0 400 400"> */}
            <Box mb={1} borderRadius={2} shadow={1} >
              <Svg width="100%">
                <VictoryPie
                  data={chartData}
                  colorScale={cores}
                  innerRadius={50}
                  labelRadius={120}
                  padding={100}
                  // labels={({ datum }) => `${datum.x}: R$${datum.y}`}
                  labels={({ datum }) => `${gastoTotal === 0 ? '' : (100 * datum.y / gastoTotal).toFixed(2) + '%'}\n${datum.x}\n${gastoTotal === 0 ? '' : moeda.format(datum.y)}`}
                  animate={{ easing: 'exp' }}
                  style={{
                    labels: {
                      fill: ({ datum }) => datum.color,
                    },
                    data: {
                      fill: ({ datum }) => datum.color,
                    }
                  }}
                  events={[{
                    target: "data",

                    eventHandlers: {
                      onPress: () => {
                        return [
                          { target: "data", mutation: ({ style }) => { return style.fill === "#c43a31" ? null : { style: { fill: "#c43a31" } } } },
                          { target: "labels", mutation: ({ text }) => { return text === "clicked" ? null : { text: "clicked" } } }
                        ]
                      }
                    }
                  }]}

                >
                </VictoryPie>

                <VictoryLabel
                  textAnchor="middle" verticalAnchor="middle"
                  x={200}
                  y={200}
                  text={`Total\n${moeda.format(gastoTotal)}`}
                />




              </Svg>

            </Box>


          </Box>

        </ScrollView >
      </VStack>
      <FloatingBottomMenu />
    </Box >
  );
}
