import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../pages/login';
import Home from '../pages/home';
import Register from '../pages/register';

const Stack = createNativeStackNavigator();

export default function Routes(){
  return(
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} options={{headerShown:true}} />
      <Stack.Screen name="Login" component={Login} options={{headerShown:true}}/>
      <Stack.Screen name="Register" component={Register} options={{headerShown:true}} />
      
      
    </Stack.Navigator>
  )
}