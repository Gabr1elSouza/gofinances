import React, { useEffect, useState } from "react";
import { Button } from "../../components/Forms/Button";
import { CategorySelectButton } from "../../components/Forms/CategorySelectButton";
import { TransactionTypeButton } from "../../components/Forms/TransactionTypeButton";

import { Alert, Keyboard, Modal, TouchableWithoutFeedback } from "react-native";

import uuid from "react-native-uuid";

import { InputForm } from "../../components/Forms/InputForm";
import { CategorySelect } from "../CategorySelect";
import {
  Container,
  Fields,
  Form,
  Header,
  Title,
  TransactionTypes,
} from "./Styles";

import * as Yup from "yup";

import { useForm } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const schema = Yup.object().shape({
  name: Yup.string().required("Nome é Obrigatório"),
  amount: Yup.number()
    .typeError("Informe um valor númerico")
    .positive("O valor não pode ser negativo"),
});

export function Register() {
  const [transactionType, setTransactionType] = useState("");
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [category, setCategory] = useState({
    key: "category",
    name: "Categoria",
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  function handleTransactionsTypeSelect(type: "positive" | "negative") {
    setTransactionType(type);
  }

  function handleCloseSetCategoryModal() {
    setCategoryModalOpen(false);
  }
  function handleOpenSelectCategoryModal() {
    setCategoryModalOpen(true);
  }

  const dataKey = "@gofinance:transactions";

  const navigation = useNavigation();

  async function handleRegister(form: FormData) {
    if (!transactionType) {
      return Alert.alert("Selecione o tipo da transação");
    }
    if (category.key === "category") {
      return Alert.alert("Selecione a categoria");
    }

    const newTransaction = {
      id: String(uuid.v4()),
      name: form.name,
      amount: form.amount,
      type: transactionType,
      category: category.key,
      date: new Date(),
    };

    try {
      const data = await AsyncStorage.getItem(dataKey);
      const currentData = data ? JSON.parse(data) : [];

      const dataFormatted = [...currentData, newTransaction];

      await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted));

      setTransactionType("");
      setCategory({
        key: "category",
        name: "Categoria",
      });
      reset();
      navigation.navigate("Listagem");
    } catch (error) {
      console.log(error);
      Alert.alert("Não foi possível salvar");
    }
  }

  interface FormData {
    name: string;
    amount: string;
  }

  useEffect(() => {
    async function loadData() {
      const data = await AsyncStorage.getItem(dataKey);
      //console.log(JSON.parse(data!));
    }

    loadData();

    // ============== Remove all itens of storage =============
    // async function removeAll() {
    //   await AsyncStorage.removeItem(dataKey);
    //   console.log("all delete");
    // }

    // removeAll();
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Header>
          <Title>Cadastro</Title>
        </Header>
        <Form>
          <Fields>
            <InputForm
              name="name"
              control={control}
              placeholder="Name"
              autoCapitalize="sentences"
              autoCorrect={false}
              error={errors.name && errors.name.message}
            />
            <InputForm
              name="amount"
              control={control}
              placeholder="Preço"
              keyboardType="numeric"
              error={errors.amount && errors.amount.message}
            />
            <TransactionTypes>
              <TransactionTypeButton
                title="Income"
                type="up"
                onPress={() => handleTransactionsTypeSelect("positive")}
                isActive={transactionType === "positive"}
              />
              <TransactionTypeButton
                title="Outcome"
                type="down"
                onPress={() => handleTransactionsTypeSelect("negative")}
                isActive={transactionType === "negative"}
              />
            </TransactionTypes>
            <CategorySelectButton
              title={category.name}
              onPress={handleOpenSelectCategoryModal}
            />
          </Fields>
          <Button title="Enviar" onPress={handleSubmit(handleRegister)} />
        </Form>

        <Modal visible={categoryModalOpen}>
          <CategorySelect
            category={category}
            setCategory={setCategory}
            closeSelectCategory={handleCloseSetCategoryModal}
          />
        </Modal>
      </Container>
    </TouchableWithoutFeedback>
  );
}
