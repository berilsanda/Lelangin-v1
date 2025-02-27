import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NumericFormat } from 'react-number-format';
import { useSelector } from 'react-redux';
import { addBid } from 'src/services/firebase';

import { Buttons } from '../atoms';
import Stepper from '../atoms/Stepper';

import { Colors, Spacing, Typography } from '@/config/constant';

interface BiddingModalProps {
  auctionId: string;
  currentBid: number;
  startingBid: number;
  stepBid: number;
  disabled: boolean;
}

const BiddingModal: React.FC<BiddingModalProps> = ({
  auctionId,
  currentBid,
  startingBid,
  stepBid,
  disabled,
}) => {
  const userData = useSelector((state: any) => state.persist.userData);
  const [currentValue, setCurrentValue] = useState(0);
  const cantSubstract =
    currentValue - stepBid <= (currentBid > 0 ? currentBid : startingBid);

  useEffect(() => {
    setCurrentValue((currentBid > 0 ? currentBid : startingBid) + stepBid);
  }, [currentBid, startingBid, stepBid]);

  function onAdd() {
    setCurrentValue((prev: number) => prev + stepBid);
  }

  function onSubstract() {
    if (cantSubstract) {
      return;
    } else {
      setCurrentValue((prev: number) => prev - stepBid);
    }
  }
  return (
    <View style={styles.modalContainer}>
      <View style={{ flex: 1, marginRight: Spacing.l }}>
        <NumericFormat
          value={stepBid}
          displayType={'text'}
          prefix={'Rp '}
          thousandSeparator="."
          decimalSeparator=","
          renderText={(val) => (
            <Text style={styles.subtitle}>Kelipatan {val}</Text>
          )}
        />
        <Stepper
          value={currentValue}
          onAdd={onAdd}
          onSubstract={onSubstract}
          cantSubstract={cantSubstract}
          type="money"
          disabled={disabled}
        />
      </View>
      <Buttons
        label="Tawar"
        onPress={() =>
          addBid({
            id: auctionId,
            currentBid: currentValue,
            userId: userData.uid,
          })
        }
        disabled={disabled}
        style={{ flex: 0.4 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.l,
    borderTopWidth: 1,
    borderColor: Colors.grey.light,
  },
  subtitle: {
    ...Typography.paragraph3,
    marginBottom: Spacing.m,
    color: Colors.textSecondary,
  },
});

export default BiddingModal;
