import React from "react";

import { HighlightCard } from "../../components/HighlightCard";
import {
  Container,
  Header,
  HighlightCards,
  Icon,
  Photo,
  User,
  UserGretting,
  UserInfo,
  UserName,
  UserWrapper,
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
          <Icon name="power" />
        </UserWrapper>
      </Header>

      <HighlightCards>
        <HighlightCard />
        <HighlightCard />
        <HighlightCard />
      </HighlightCards>
    </Container>
  );
}
