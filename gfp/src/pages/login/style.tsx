import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'white',
    padding:10,
  },
  title:{
    fontSize:45,
    color:'#636b6f',
    fontWeight:'100',
  },
  input:{
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#444',
    marginBottom: 20,
    borderRadius:15,
  },
  btnLogin:{
    width: '100%',
    height: 40,
    backgroundColor:'#bc14ff',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  txtWhite:{
    color:'white',
    fontWeight:'bold',
    fontSize:16,
  }
});