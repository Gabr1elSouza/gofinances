import React from "react";



import {
  Container,
  Header,
  UserWrapper,
  Photo,
  User,
  UserGretting,
  UserInfo,
  UserName,
  Icon,
} from "./styles";

export function Dashboard() {
  return (
    <Container>
      <Header>
        <UserWrapper>
        <UserInfo>
          <Photo source={{ uri: "https://github.com/Gabr1elSouza.png" }} />
          <User>
            <UserGretting>Olá,</UserGretting>
            <UserName>Gabriel</UserName>
          </User>
        </UserInfo>
        <Icon name="power"/>

        </UserWrapper>
      </Header>
    </Container>
  );
}
