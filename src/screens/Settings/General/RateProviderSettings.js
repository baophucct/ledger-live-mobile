/* @flow */
import React, { Component } from "react";
import { connect } from "react-redux";
import i18next from "i18next";
import { findCurrencyByTicker } from "@ledgerhq/live-common/lib/currencies";

import type { Currency } from "@ledgerhq/live-common/lib/types";

import type { State } from "../../../reducers";
import { setExchangePairsAction } from "../../../actions/settings";
import makeGenericSelectScreen from "../../makeGenericSelectScreen";
import CounterValues from "../../../countervalues";

const getExchanges = (from: Currency, to: Currency) =>
  CounterValues.fetchExchangesForPair(from, to);

const extractFromTo = props => {
  const { params } = props.navigation.state;
  const from = findCurrencyByTicker(params.from);
  const to = findCurrencyByTicker(params.to);
  return { from, to };
};

const injectItems = C => {
  class Clz extends Component<*, *> {
    state = {
      items: [],
    };

    async componentWillMount() {
      const { from, to } = extractFromTo(this.props);
      const exchanges = from && to ? await getExchanges(from, to) : [];
      this.setState({ items: exchanges });
    }

    render() {
      const { items } = this.state;
      const { from, to } = extractFromTo(this.props);
      return <C {...this.props} from={from} to={to} items={items} />;
    }
  }
  // $FlowFixMe
  Clz.navigationOptions = C.navigationOptions;

  return Clz;
};

const mapStateToProps = (state: State, props: *) => ({
  selectedKey: props.navigation.state.params.selected,
});

const mapDispatchToProps = {
  onValueChange: ({ id }: *, { from, to }) =>
    setExchangePairsAction([{ from, to, exchange: id }]),
};

const Screen = makeGenericSelectScreen({
  id: "RateProviderSettingsSelect",
  itemEventProperties: item => ({ exchange: item.id }),
  title: i18next.t("settings.display.exchangeHeader"),
  keyExtractor: item => item.id,
  formatItem: item => item.name,
  navigationOptions: {
    headerRight: null,
  },
});

export default injectItems(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Screen),
);
