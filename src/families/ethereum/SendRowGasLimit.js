/* @flow */
import React, { PureComponent } from "react";
import { View, StyleSheet } from "react-native";
import { translate } from "react-i18next";
import type { Account, TokenAccount } from "@ledgerhq/live-common/lib/types";
import type { Transaction } from "@ledgerhq/live-common/lib/bridge/EthereumJSBridge";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import { BigNumber } from "bignumber.js";
import { getMainAccount } from "@ledgerhq/live-common/lib/account/helpers";
import type { T } from "../../types/common";
import LText from "../../components/LText";
import colors from "../../colors";
import SummaryRow from "../../screens/SendFunds/SummaryRow";

type Props = {
  account: Account | TokenAccount,
  parentAccount: ?Account,
  transaction: Transaction,
  navigation: *,
  t: T,
};

type State = {
  gasLimit: ?BigNumber,
};
class EthereumGasLimit extends PureComponent<Props, State> {
  editGasLimit = () => {
    const { account, parentAccount, navigation, transaction } = this.props;
    navigation.navigate("EthereumEditGasLimit", {
      accountId: account.id,
      parentId: parentAccount && parentAccount.id,
      transaction,
    });
  };

  render() {
    const { account, parentAccount, t, transaction } = this.props;
    const mainAccount = getMainAccount(account, parentAccount);
    const bridge = getAccountBridge(account, parentAccount);
    const gasLimit = bridge.getTransactionExtra(
      mainAccount,
      transaction,
      "gasLimit",
    );
    return (
      <View>
        <SummaryRow title={t("send.summary.gasLimit")} info="info">
          <View style={styles.gasLimitContainer}>
            {gasLimit && (
              <LText style={styles.gasLimitText}>{gasLimit.toString()}</LText>
            )}
            <LText style={styles.link} onPress={this.editGasLimit}>
              {t("common.edit")}
            </LText>
          </View>
        </SummaryRow>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  link: {
    color: colors.live,
    textDecorationStyle: "solid",
    textDecorationLine: "underline",
    textDecorationColor: colors.live,
    marginLeft: 8,
  },
  gasLimitContainer: {
    flexDirection: "row",
  },
  gasLimitText: {
    fontSize: 16,
    color: colors.darkBlue,
  },
});

export default translate()(EthereumGasLimit);
