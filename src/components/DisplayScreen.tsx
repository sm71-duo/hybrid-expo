import React from "react";
import { ActivityIndicator, Text } from "react-native";
import styled from "styled-components/native";
import { palette, spacing } from "../styles/styling";

type DisplayScreenprops = {
  hasError?: boolean;
  channelName: string;
  connections: number;
  loading?: boolean;
  turnedOn?: boolean;
};

const DisplayScreen: React.FC<DisplayScreenprops> = (
  props: DisplayScreenprops
) => {
  if (props.hasError) {
    return (
      <Display turnedOn={props.turnedOn}>
        <ErrorText>An error has occured..</ErrorText>
      </Display>
    );
  }

  if (props.loading) {
    return (
      <Display turnedOn={props.turnedOn}>
        <LoadingView>
          <ActivityIndicator size="large" color={palette.dark} />
        </LoadingView>
      </Display>
    );
  }

  return (
    <Display turnedOn={props.turnedOn}>
      {props.turnedOn && (
        <>
          <Text>FM: {props.channelName}</Text>
          <UserInfo>
            <Text>Users</Text>
            <UserAmountText>{props.connections}</UserAmountText>
          </UserInfo>
        </>
      )}
    </Display>
  );
};

const Display = styled.View.attrs({
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 4,
  },
  shadowOpacity: 1,
  shadowRadius: 2,
})`
  margin-top: 40px;
  padding: ${spacing.s4}px;
  height: 185px;
  border: 8px solid #4e4e4e;
  border-radius: ${spacing.s6}px;
  flex-direction: row;
  justify-content: space-between;
  background-color: ${(props: { turnedOn?: boolean }) =>
    props.turnedOn ? "#a2bea0" : "#a2bea060"};
`;

const LoadingView = styled.View`
  align-items: center;
  justify-content: center;
  flex: 1;
`;

const UserInfo = styled.View`
  align-items: flex-end;
`;

const UserAmountText = styled.Text`
  color: #009206;
  font-size: 22px;
`;

const ErrorText = styled.Text`
  color: #ff0000;
  font-size: 18px;
`;

export default DisplayScreen;
