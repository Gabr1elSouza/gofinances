import React, { useCallback, useEffect, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { HighlightCard } from "../../components/HighlightCard";
import {
  TransactionCard,
  TransactionCardProps,
} from "../../components/TransactionCard";
import {
  Container,
  Header,
  HighlightCards,
  Icon,
  LogoutButton,
  Photo,
  Title,
  Transactions,
  TransactionsList,
  User,
  UserGretting,
  UserInfo,
  UserName,
  UserWrapper,
} from "./styles";
import { useFocusEffect } from "@react-navigation/native";

export interface DataListProps extends TransactionCardProps {
  id: string;
}

export function Dashboard() {
  const [data, setData] = useState<DataListProps[]>([]);
  const dataKey = "@gofinance:transactions";
  async function loadTransactions() {
    const response = await AsyncStorage.getItem(dataKey);

    const transactions = response ? JSON.parse(response) : [];
    setData(transactions);

    const transactionsFormatted: DataListProps[] = transactions.map(
      (item: DataListProps) => {
        const amount = Number(item.amount).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });

        const date = Intl.DateTimeFormat("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        }).format(new Date(item.date));

        return {
          id: item.id,
          name: item.name,
          amount,
          date,
          type: item.type,
          category: item.category,
        };
      }
    );

    setData(transactionsFormatted);
    console.log(transactionsFormatted)
  }

  useEffect(() => {
    loadTransactions();
  }, []);

  useFocusEffect(useCallback(()=>{
    loadTransactions()
  },[]))

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
          <LogoutButton onPress={() => {}}>
            <Icon name="power" />
          </LogoutButton>
        </UserWrapper>
      </Header>

      <HighlightCards>
        <HighlightCard
          type="up"
          title="Entrada"
          amount="R$ 17.400,00"
          lastTransaction="Última entrada dia 13 de abril"
        />
        <HighlightCard
          type="down"
          title="Saidas"
          amount="R$ 1.259,00"
          lastTransaction="Última entrada dia 03 de abril"
        />
        <HighlightCard
          type="total"
          title="Total"
          amount="R$ 16.141,00"
          lastTransaction="01 à 16 de abril"
        />
      </HighlightCards>

      <Transactions>
        <Title>Listagem</Title>
        {data.length > 0 && (
          <TransactionsList
            data={data}
            keyExtractor={(item) => item.id }
            renderItem={({ item }) => <TransactionCard data={item} />}
          />
        )}
      </Transactions>
    </Container>
  );
}
