import { BACKEND_HOST, BACKEND_PORT } from "@env";
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Box, HStack, Icon, List, ScrollView, Spacer, Text, VStack } from "native-base";
import React, { useContext, useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { VictoryPie } from 'victory-native';
import CategoryIcon from "../../components/Dashboard/Icons/CategoryIcon";
import Balance from "../../components/Dashboard/balance";
import FloatingBottomMenu from "../../components/FloatingBottomMenu";
import Header from "../../components/Header";
import { Icons } from '../../components/Icons/Icons';
import ListTransactionByCategory from '../../components/ListTransactionByCategory';
import { Store } from '../../contexts/StoreProvider';

interface ApiData {
  amount: number;
  category: string;
  id: number;
}

interface DataCategory {
  x: string;
  y: number;
  category: string;
  id?: number;
  color: string;
  iconName: string;
}

export default function Dashboard() {
  const { user, setUser, token, setToken, profile, setProfile, startDate, endDate, despesaTotal, setDespesaTotal, receitaTotal, setReceitaTotal, setTransactionTypes, } = useContext(Store);
  const [apiDataDespesasPorCategorias, setApiDataDespesasPorCategorias] = useState<ApiData[]>([]);
  const [apiDataRendasPorCategorias, setApiDataRendasPorCategorias] = useState<ApiData[]>([]);
  // const [gastoTotal, setGastoTotal] = useState(0);
  // const [rendaTotal, setRendaTotal] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState([]);


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
  // });

  const fetchData = async () => {
    console.log('dashboard')
    try {
      // let startDate = new Date(data.getFullYear(), data.getMonth(), 1).toISOString().slice(0, 10);
      // let endDate = new Date(data.getFullYear(), data.getMonth() + 1, 0).toISOString().slice(0, 10);

      //Buscar Perfil do usuário
      const profileResponse = await fetch(`http://${BACKEND_HOST}:${BACKEND_PORT}/profile/byUser/${user.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token.access_token}`
        },
      }).then((response) => response.json())

      setProfile({ ...profileResponse });

      if (profileResponse.name == null || profileResponse.birthday == null || profileResponse.lastname == null || profileResponse.monthly_income == null || profileResponse.gender_id == null || profileResponse.profession == null) {
        handleNavigateManageProfile()
      }

      // Buscar contas do usuário
      const accountResponse = await fetch(`http://${BACKEND_HOST}:${BACKEND_PORT}/account/byProfile/${profileResponse.id || profile.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token.access_token}`
        },
      })
        .then((response) => response.json())

      if (accountResponse.length == 0) {
        handleNavigateAddAccount()
      }

      let payload = {
        "profileId": profileResponse.id || profile.id,
        "startDate": startDate,
        "endDate": endDate
      }

      // Buscar despesas do usuário por categoria em um determinado período
      const despesasporcategorias = await fetch(`http://${BACKEND_HOST}:${BACKEND_PORT}/dashboard/despesasporcategorias`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }).then((response) => response.json())


      // if (despesasporcategorias.length === 0) {
      //   // handleNavigateAddTransaction()
      // }

      if (despesasporcategorias.length !== 0) {
        // let countGastoMensal = 0;
        // despesasporcategorias.forEach((item: ApiData) => {
        //   countGastoMensal += item.amount;
        // });
        // setGastoTotal(countGastoMensal);

        setApiDataDespesasPorCategorias(despesasporcategorias);
      }


      // Buscar rendas do usuário por categoria em um determinado período
      const rendasporcategorias = await fetch(`http://${BACKEND_HOST}:${BACKEND_PORT}/dashboard/rendasporcategorias`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }).then((response) => response.json())

      if (rendasporcategorias.length !== 0) {
        // let countRendaMensal = 0;
        // console.log("rendasporcategorias", JSON.stringify(rendasporcategorias, null, 2))
        // rendasporcategorias.forEach((item: ApiData) => {
        //   countRendaMensal += item.amount;
        // });
        // setRendaTotal(countRendaMensal);

        setApiDataRendasPorCategorias(rendasporcategorias);
      }




      // Obter os tipos de transações
      const res_transactionTypes = await fetch(`http://${BACKEND_HOST}:${BACKEND_PORT}/transactiontypes`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
        }
      }).then((response) => response.json())
      setTransactionTypes(res_transactionTypes);
      // setTypeId(res_transactionTypes[0].id);


    } catch (error) {
      console.log("dashboard", error);
    }
  };

  const getCategoryIcon = (categoryName: string): string => Icons.filter((item) => item.category === categoryName)[0]?.icon || "help";
  const getCategoryColor = (categoryName: string): string => Icons.filter((item) => item.category === categoryName)[0]?.color || "gray.500";
  const listCategoryColor = (): string[] => Icons.map((item) => { return item.color });

  let chartDataDespesas: DataCategory[] = apiDataDespesasPorCategorias.map((item, index) => ({
    x: item.category,
    y: item.amount,
    category: item.category,
    id: item.id,
    color: getCategoryColor(item.category),
    iconName: getCategoryIcon(item.category),
  }));

  if (chartDataDespesas.length === 0) {
    chartDataDespesas = [{
      x: 'Sem despesas',
      y: 0.001,
      category: 'Sem despesas',
      color: '#a4a3a3',
      iconName: 'help',
    }]
  }

  let chartDataRendas: DataCategory[] = apiDataRendasPorCategorias.map((item, index) => ({
    x: item.category,
    y: item.amount,
    category: item.category,
    id: item.id,
    color: getCategoryColor(item.category),
    iconName: getCategoryIcon(item.category),
  }));

  if (chartDataRendas.length === 0) {
    chartDataRendas = [{
      x: 'Sem rendas',
      y: 0.001,
      category: 'Sem rendas',
      color: '#a4a3a3',
      iconName: 'help',
    }]
  }





  // const CategoryIcon = (props: any) => {
  //   return <Icon
  //     as={<MaterialIcons name={props.iconName} color={props.color} />}
  //     size={5}
  //     ml={2}
  //     color={props.color}
  //   />

  // };


  function handleListTransactionByCategory(categoria: DataCategory): void {
    let { x, y, category, id, color, iconName } = categoria;
    console.log("ListTransactionByCategory", categoria)
    navigation.navigate('ListTransactionByCategory', { x, y, category, id, color, iconName });
  }

  return (
    <Box flex={1} bg="white" height="full">
      <Header />
      <VStack width="full">

        <ScrollView height="85%">
          <Balance />
          <Box width="full" mt={1} mb={1}>
            <Text fontSize="lg" fontWeight="bold" mb={3} color={'black'} bold textAlign={'center'}>Despesas por categoria</Text>

            <Box mb={1} borderRadius={2} shadow={1} >
              <VictoryPie
                events={[{
                  target: "data",
                  eventHandlers: {
                    onPressIn: () => {
                      return [
                        {
                          target: "data",
                          mutation: ({ radius, datum }) => {
                            let newRadius = radius
                            if (selectedCategory.includes(datum.x)) {
                              setSelectedCategory(selectedCategory.filter((item) => item !== datum.x))
                              newRadius = radius - 10
                            }
                            else {
                              setSelectedCategory([...selectedCategory, datum.x])
                              newRadius = radius + 10
                            }
                            return { radius: newRadius };
                          }
                        }
                      ];
                    }
                  }
                }]}
                data={chartDataDespesas}
                colorScale={listCategoryColor()}
                innerRadius={50}
                labelRadius={120}
                padding={100}
                labels={({ datum }) => `${despesaTotal === 0 ? '' : (100 * datum.y / despesaTotal).toFixed(2) + '%'}\n${datum.x}\n${despesaTotal === 0 ? '' : moeda.format(datum.y)}`}
                animate={{ easing: 'exp' }}
                style={{
                  labels: {
                    fill: ({ datum }) => datum.color,
                  },
                  data: {
                    fill: ({ datum }) => datum.color,
                  }
                }}

              >
              </VictoryPie>
              <Box mb={100} >
                {
                  chartDataDespesas.map((item, index) => (
                    <TouchableOpacity key={index} onPress={() => handleListTransactionByCategory(item)}>
                      <List key={index} my={0} px={2} py={5} shadow={0} borderRadius={0} bg='white'>
                        <HStack space={2} alignItems="center">
                          <CategoryIcon color={item.color} category={item.category} size={5} />
                          <Text bold color={item.color}>{item.x}</Text>
                          <Spacer />
                          <Text bold color={item.color}>{(100 * item.y / despesaTotal).toFixed(2)}%    {moeda.format(item.y)}</Text>
                        </HStack>
                      </List>
                    </TouchableOpacity>
                  ))
                }
              </Box>

            </Box>

            <Text fontSize="lg" fontWeight="bold" mb={3} color={'black'} bold textAlign={'center'}>Rendas por categoria</Text>

            <Box mb={1} borderRadius={2} shadow={1} >
              <VictoryPie
                events={[{
                  target: "data",
                  eventHandlers: {
                    onPressIn: () => {
                      return [
                        {
                          target: "data",
                          mutation: ({ radius, datum }) => {
                            let newRadius = radius
                            if (selectedCategory.includes(datum.x)) {
                              setSelectedCategory(selectedCategory.filter((item) => item !== datum.x))
                              newRadius = radius - 10
                            }
                            else {
                              setSelectedCategory([...selectedCategory, datum.x])
                              newRadius = radius + 10
                            }
                            return { radius: newRadius };
                          }
                        }
                      ];
                    }
                  }
                }]}
                data={chartDataRendas}
                colorScale={listCategoryColor()}
                innerRadius={50}
                labelRadius={120}
                padding={100}
                labels={({ datum }) => `${receitaTotal === 0 ? '' : (100 * datum.y / receitaTotal).toFixed(2) + '%'}\n${datum.x}\n${receitaTotal === 0 ? '' : moeda.format(datum.y)}`}
                animate={{ easing: 'exp' }}
                style={{
                  labels: {
                    fill: ({ datum }) => datum.color,
                  },
                  data: {
                    fill: ({ datum }) => datum.color,
                  }
                }}

              >
              </VictoryPie>
              <Box mb={100} >
                {
                  chartDataRendas.map((item, index) => (
                    <TouchableOpacity key={index} onPress={() => handleListTransactionByCategory(item)}>
                      <List key={index} my={0} px={2} py={5} shadow={0} borderRadius={0} bg='white'>
                        <HStack space={2} alignItems="center">
                          <CategoryIcon color={item.color} category={item.category} size={5} />
                          <Text bold color={item.color}>{item.x}</Text>
                          <Spacer />
                          <Text bold color={item.color}>{(100 * item.y / receitaTotal).toFixed(2)}%    {moeda.format(item.y)}</Text>
                        </HStack>
                      </List>
                    </TouchableOpacity>
                  ))
                }
              </Box>

            </Box>
          </Box>
        </ScrollView >
      </VStack>
      <FloatingBottomMenu />
    </Box >
  );
}
