import { StatusBar } from "expo-status-bar";
import React from "react";
import styled from "styled-components/native";
import HomeView from "./src/views/HomeView";
import { WebsocketProvider } from "./src/hooks/useWebsockets";

export default function App() {
  return (
    <WebsocketProvider>
      <Wrapper>
        <HomeView />
        <StatusBar style="auto" />
      </Wrapper>
    </WebsocketProvider>
  );
}

const Wrapper = styled.View`
  flex: 1;
`;
