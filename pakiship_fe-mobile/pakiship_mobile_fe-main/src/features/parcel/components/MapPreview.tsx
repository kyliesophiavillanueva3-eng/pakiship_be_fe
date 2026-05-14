import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MapPin } from 'lucide-react-native';

interface Props {
  pickupAddress?: string;
  deliveryAddress?: string;
  estimatedTime?: string;
  driverName?: string;
  driverPhone?: string;
  trackingNumber?: string;
  showDriverInfo?: boolean;
}

export default function MapPreview({ pickupAddress, deliveryAddress, estimatedTime }: Props) {
  return (
    <View style={styles.container}>
      <MapPin size={40} color="#39B5A8" />
      <Text style={styles.label}>Map Preview</Text>
      {pickupAddress ? <Text style={styles.addr}>From: {pickupAddress}</Text> : null}
      {deliveryAddress ? <Text style={styles.addr}>To: {deliveryAddress}</Text> : null}
      {estimatedTime ? <Text style={styles.eta}>ETA: {estimatedTime}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#E8F5F4', padding: 20 },
  label: { fontSize: 14, fontWeight: '800', color: '#1A5D56', marginTop: 8 },
  addr: { fontSize: 12, color: '#555', marginTop: 4, textAlign: 'center' },
  eta: { fontSize: 12, fontWeight: '700', color: '#39B5A8', marginTop: 6 },
});
