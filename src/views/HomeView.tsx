import React from "react";
import { View, Text } from "react-native";
import styled from "styled-components/native";
import { spacing } from "../styles/styling";

const HomeView = () => {
  return (
    <Wrapper>
      <Text>Eyoo</Text>
    </Wrapper>
  );
};

const Wrapper = styled.View`
  margin: ${spacing.s4}px;
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export default HomeView;
