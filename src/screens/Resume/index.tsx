import AsyncStorage from "@react-native-async-storage/async-storage";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { addMonths, format, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale/pt";
import React, { useCallback, useState } from "react";
import { RFValue } from "react-native-responsive-fontsize";
import { VictoryPie } from "victory-native";
import { HistoryCard } from "../../components/HistoryCard";
import { categories } from "../../utils/categories";
import {
  ChartContainer,
  Container,
  Content,
  Header,
  LoadContainer,
  Month,
  MonthSelect,
  MounthSelectButton,
  MountSelectIcon,
  Title,
} from "./styles";

import { useFocusEffect } from "@react-navigation/native";
import { ActivityIndicator } from "react-native";
import { useTheme } from "styled-components";

interface TransactionData {
  id: string;
  name: string;
  amount: string;
  category: string;
  date: string;
  type: "positive" | "negative";
}

interface CategoryData {
  key: string;
  name: string;
  total: number;
  totalFormated: string;
  color: string;
  percent: string;
}

export function Resume() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>(
    []
  );

  const theme = useTheme();

  function handleChangeDate(action: "next" | "prev") {
    if (action === "next") {
      setSelectedDate(addMonths(selectedDate, 1));
    } else {
      setSelectedDate(subMonths(selectedDate, 1));
    }
  }

  async function loadData() {
    const dataKey = "@gofinance:transactions";
    const response = await AsyncStorage.getItem(dataKey);
    const responseFormatted = response ? JSON.parse(response) : [];

    const expensives = responseFormatted.filter(
      (expensive: TransactionData) =>
        expensive.type === "negative" &&
        new Date(expensive.date).getMonth() === selectedDate.getMonth() &&
        new Date(expensive.date).getFullYear() === selectedDate.getFullYear()
    );

    const expensivesTotal = expensives.reduce(
      (acumullator: number, expensive: TransactionData) => {
        return acumullator + Number(expensive.amount);
      },
      0
    );

    const totalByCategory: CategoryData[] = [];

    categories.forEach((category) => {
      let categorySum = 0;

      expensives.forEach((expensive: TransactionData) => {
        if (expensive.category === category.key) {
          categorySum += Number(expensive.amount);
        }
      });
      if (categorySum > 0) {
        const totalFormated = categorySum.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });

        const percent = `${((categorySum / expensivesTotal) * 100).toFixed(
          0
        )}%`;

        totalByCategory.push({
          name: category.name,
          total: categorySum,
          color: category.color,
          key: category.key,
          totalFormated,
          percent,
        });
      }
    });

    setTotalByCategories(totalByCategory);
    setIsLoading(false)
  }

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [selectedDate])
  );
  return (
    <Container>
      {isLoading ? (
        <LoadContainer>
          <ActivityIndicator color={theme.colors.primary} size="large" />
        </LoadContainer>
      ) : (
        <>
          <Header>
            <Title>Resumo por categoria</Title>
          </Header>

          <Content
            showVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 24,
              paddingBottom: useBottomTabBarHeight(),
            }}
          >
            <MonthSelect>
              <MounthSelectButton onPress={() => handleChangeDate("prev")}>
                <MountSelectIcon name="chevron-left" />
              </MounthSelectButton>

              <Month>
                {format(selectedDate, "MMMM, YYYY", { locale: ptBR })}
              </Month>

              <MounthSelectButton onPress={() => handleChangeDate("next")}>
                <MountSelectIcon name="chevron-right" />
              </MounthSelectButton>
            </MonthSelect>
            <ChartContainer>
              <VictoryPie
                data={totalByCategories}
                colorScale={totalByCategories.map((category) => category.color)}
                style={{
                  labels: {
                    fontSize: RFValue(18),
                    fontWeight: "bold",
                    fill: theme.colors.shape,
                  },
                }}
                labelRadius={50}
                x="percent"
                y="total"
              />
            </ChartContainer>
            {totalByCategories.map((item) => (
              <HistoryCard
                key={item.key}
                title={item.name}
                amount={item.totalFormated}
                color={item.color}
              />
            ))}
          </Content>
        </>
      )}
    </Container>
  );
}
