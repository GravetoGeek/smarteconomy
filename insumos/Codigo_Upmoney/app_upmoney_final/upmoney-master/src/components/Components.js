import styled from 'styled-components/native';

/***********************/
/*       Reset        */
/*********************/

const Container = styled.View`
    padding: 20px 25px; 
`;


/***********************/
/*       Button       */
/*********************/

const ButtonBlue = styled.View`
    display: flex;
    width: 100%;
    height: 45px;
    padding: 10px;
    border-radius: 5px;
    background-color: #212844;
    align-items: center;
    justify-content: center;
`;

const ButtonGreen = styled.View`
    display: flex;
    width: 100%;
    height: 45px;
    padding: 10px;
    border-radius: 5px;
    background-color: #06C496;
    align-items: center;
    justify-content: center;
`;

const ButtonRed = styled.View`
    display: flex;
    width: 100%;
    height: 45px;
    /* border: 2px solid  #c61f1f; */
    padding: 10px;
    border-radius: 5px;
    align-items: center;
    justify-content: center;
`;

const ButtonTextSimple = styled.Text`
    font-family: 'Roboto-Black';
    font-size: 14px;
    color: white;
`;

const ButtonText = styled.Text`
    font-family: 'Roboto-Black';
    font-size: 16px;
    color: white;
    text-transform: uppercase;
`;

const ButtonTextRed = styled.Text`
    font-family: 'Roboto-Black';
    font-size: 14px;
    color: #c61f1f;
    text-transform: uppercase;
`;


export { Container, ButtonBlue, ButtonText, ButtonRed, ButtonTextRed,ButtonTextSimple, ButtonGreen };