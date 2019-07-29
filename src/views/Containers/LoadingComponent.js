import React, {Component} from 'react';
import { Container, Image } from 'react-bootstrap';
import Loading from '../../logo/Infinity-1.6s-104px.svg';

export default class LoadingComponent extends Component {
    render(){
        let styles = { 
            display: 'flex', 
            justifyContent: 'center', 
            flexDirection: 'column', 
            fontSize: '2rem', 
            color: 'green', 
            textAlign: 'center',
            marginTop: '250px' 
        };
        return(
            <Container>
              <div style={styles}>
                <Image src={Loading} alt='loading' />
                <br />
                <div>Chargement...</div>
              </div>
            </Container>
        )
    }
}