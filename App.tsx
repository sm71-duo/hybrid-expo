import { StatusBar } from "expo-status-bar";
import React from "react";
import styled from "styled-components/native";
import AgoraView from "./src/views/AgoraView";
// import HomeView from "./src/views/HomeView";

export default function App() {
  return (
    <Wrapper>
      <AgoraView />
      <StatusBar style="auto" />
    </Wrapper>
  );
}

const Wrapper = styled.View`
  flex: 1;
`;
