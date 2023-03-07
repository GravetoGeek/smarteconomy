import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../screens/login';
import Home from '../screens/home';
import Register from '../screens/register';
import Dashboard from '../screens/dashboard'

const Stack = createNativeStackNavigator();

export default function Routes(){
  return(
    <Stack.Navigator>
      
      {/* <Stack.Screen name="Home" component={Home} options={{headerShown:true}} /> */}
      <Stack.Screen name="Dashboard" component={Dashboard} options={{headerShown:true}} />
      <Stack.Screen name="Login" component={Login} options={{headerShown:true}}/>
      <Stack.Screen name="Register" component={Register} options={{headerShown:true}} />
      
      
      
    </Stack.Navigator>
  )
}