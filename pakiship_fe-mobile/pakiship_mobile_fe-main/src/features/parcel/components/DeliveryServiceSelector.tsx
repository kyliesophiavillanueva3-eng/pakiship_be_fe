import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Users, Zap, Truck, ShieldCheck, Navigation, Package, CheckCircle2, ClipboardList, MapPin } from 'lucide-react-native';

interface Service {
  id: string;
  name: string;
  sub: string;
  time: string;
  price: number;
  icon: any;
  available: boolean;
  tags?: string[];
}

const getServices = (distanceKm: number, packageSize: string, totalParcels: number): Service[] => {
  const safeDistance = isNaN(distanceKm) || distanceKm < 0 ? 0 : distanceKm;
  const sizeMultiplier = packageSize === 'xl' ? 1.5 : packageSize === 'medium' ? 1.2 : 1.0;
  const quantitySurcharge = Math.max(0, (totalParcels - 1) * 10); // ₱10 per extra parcel

  return [
    { 
      id: 'share', 
      name: 'PakiShare', 
      sub: 'Relay Economy', 
      time: '2-4 hrs', 
      price: Math.round((40 + safeDistance * 8) * sizeMultiplier + quantitySurcharge), 
      icon: Users,
      available: true,
      tags: [`₱40 BASE + ₱8/KM`, 'MULTI-STOP', `${packageSize.toUpperCase()} SIZE`]
    },
    { 
      id: 'express', 
      name: 'PakiExpress', 
      sub: 'Direct Delivery', 
      time: '30-60 mins', 
      price: Math.round((50 + safeDistance * 10) * sizeMultiplier + quantitySurcharge), 
      icon: Zap,
      available: true, 
      tags: [`₱50 BASE + ₱10/KM`, 'DIRECT TO DOOR', 'PRIORITY HANDLING']
    },
    { 
      id: 'business', 
      name: 'PakiBusiness', 
      sub: 'Fleet Bulk', 
      time: '1-2 hrs', 
      price: Math.round((150 + safeDistance * 20) * sizeMultiplier + (totalParcels * 15)), 
      icon: Truck,
      available: false,
      tags: ['BULK PRICING', 'HEAVY DUTY', 'PRIORITY FLEET']
    },
  ];
};

interface Props {
  distanceKm: number;
  onSelect: (id: string, price: number) => void;
  selectedService: string;
  totalParcels: number;
  packageSize: string;
  selectedDropOffPoint: any;
  onShowHubSelector: () => void;
}

export default function DeliveryServiceSelector({ 
  distanceKm, 
  onSelect, 
  selectedService, 
  totalParcels,
  packageSize,
  selectedDropOffPoint,
  onShowHubSelector
}: Props) {
  
  const services = React.useMemo(() => getServices(distanceKm, packageSize, totalParcels), [distanceKm, packageSize, totalParcels]);
  const selectedSvcData = services.find(s => s.id === selectedService);

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scroll} 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        
        <View style={styles.selectorCard}>
          <Text style={styles.cardHeading}>Select delivery service</Text>
          
          <View style={styles.detailsRow}>
            <View style={styles.chip}>
              <Navigation size={12} color="#9CA3AF" />
              <Text style={styles.chipText}>{distanceKm} km</Text>
            </View>
            <View style={styles.chip}>
              <Package size={12} color="#9CA3AF" />
              <Text style={styles.chipText}>{totalParcels} {totalParcels === 1 ? 'unit' : 'units'}</Text>
            </View>
          </View>

          <View style={styles.serviceList}>
            {services.map(svc => {
              const Icon = svc.icon;
              const isSelected = selectedService === svc.id;
              const isAvailable = svc.available;

              return (
                <View key={svc.id} style={styles.serviceContainer}>
                  <TouchableOpacity 
                    disabled={!isAvailable}
                    style={[
                      styles.serviceCard, 
                      isSelected && styles.serviceCardActive,
                      !isAvailable && styles.serviceCardDisabled
                    ]} 
                    onPress={() => onSelect(svc.id, svc.price)}
                  >
                    <View style={[
                      styles.iconBox, 
                      isSelected && styles.iconBoxActive,
                      !isAvailable && styles.iconBoxDisabled
                    ]}>
                      <Icon size={22} color={isSelected ? '#fff' : isAvailable ? '#D1D5DB' : '#E5E7EB'} />
                    </View>
                    
                    <View style={styles.serviceInfo}>
                      <Text style={[styles.serviceName, !isAvailable && styles.textDisabled]}>{svc.name}</Text>
                      <Text style={styles.serviceSub}>
                        {svc.sub} <Text style={styles.timeHighlight}>{svc.time}</Text>
                      </Text>
                    </View>

                    <View style={styles.priceInfo}>
                      <Text style={[styles.priceTag, !isAvailable && styles.textDisabled]}>₱{svc.price}</Text>
                      <Text style={styles.perTrip}>PER TRIP</Text>
                    </View>
                  </TouchableOpacity>

                  {/* Selected Tags Row */}
                  {isSelected && svc.tags && (
                    <View style={styles.tagsContainer}>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tagsScroll}>
                        {svc.tags.map((tag, i) => (
                          <View key={i} style={styles.tagItem}>
                            <CheckCircle2 size={12} color="#39B5A8" />
                            <Text style={styles.tagText}>{tag}</Text>
                          </View>
                        ))}
                      </ScrollView>
                    </View>
                  )}

                  {/* Hub Selection for PakiShare */}
                  {isSelected && svc.id === 'share' && (
                    <View style={styles.hubDisplay}>
                      <View style={styles.hubHeader}>
                        <MapPin size={14} color="#39B5A8" />
                        <Text style={styles.hubLabel}>SELECTED DROP-OFF HUB</Text>
                      </View>
                      <View style={styles.hubBody}>
                        {selectedDropOffPoint ? (
                          <>
                            <View style={{ flex: 1 }}>
                              <Text style={styles.hubValue}>{selectedDropOffPoint.name}</Text>
                              <Text style={styles.hubSub} numberOfLines={1}>{selectedDropOffPoint.address}</Text>
                            </View>
                            <TouchableOpacity style={styles.changeHubBtn} onPress={onShowHubSelector}>
                              <Text style={styles.changeHubText}>Change</Text>
                            </TouchableOpacity>
                          </>
                        ) : (
                          <TouchableOpacity style={styles.selectHubPrompt} onPress={onShowHubSelector}>
                            <Text style={styles.selectHubPromptText}>Tap to select a drop-off hub</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  )}
                </View>
              );
            })}
          </View>

          {/* Bill Summary Section */}
          {selectedService && selectedSvcData && (
             <View style={styles.billSummary}>
                <View style={styles.billHeader}>
                  <ClipboardList size={14} color="#9CA3AF" />
                  <Text style={styles.billHeading}>BILL SUMMARY</Text>
                </View>
                
                <View style={styles.billRow}>
                  <Text style={styles.billLabel}>Subtotal</Text>
                  <Text style={styles.billValue}>₱{(selectedSvcData.price - 5).toFixed(2)}</Text>
                </View>

                <View style={styles.billRow}>
                  <Text style={styles.billLabel}>Platform Fee</Text>
                  <Text style={styles.billValue}>₱5.00</Text>
                </View>
                
                <View style={styles.dashedDivider} />
                
                <View style={styles.billRow}>
                  <Text style={styles.totalLabel}>Total Amount</Text>
                  <Text style={styles.totalValue}>₱{selectedSvcData.price.toFixed(2)}</Text>
                </View>
             </View>
          )}

          <View style={[styles.transparencyBanner, selectedService && { marginTop: 12 }]}>
            <View style={styles.bannerHeader}>
              <ShieldCheck size={16} color="#39B5A8" />
              <Text style={styles.bannerTitle}>PakiShip Transparency</Text>
            </View>
            <Text style={styles.bannerContent}>
              Rates based on small size. Includes real-time tracking.
            </Text>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 40 },

  selectorCard: {
    backgroundColor: '#fff',
    borderRadius: 32,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 2,
  },
  cardHeading: {
    fontSize: 22,
    fontWeight: '900',
    color: '#041614',
    marginBottom: 12,
  },
  detailsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    gap: 6,
  },
  chipText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#9CA3AF',
  },

  serviceList: {
    gap: 12,
    marginBottom: 16,
  },
  serviceContainer: {
    gap: 8,
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#F9FAFB',
  },
  serviceCardActive: {
    borderColor: '#39B5A8',
    backgroundColor: '#fff',
  },
  serviceCardDisabled: {
    opacity: 0.5,
    backgroundColor: '#FCFCFC',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  iconBoxActive: {
    borderColor: 'rgba(57,181,168,0.1)',
    backgroundColor: '#39B5A8',
  },
  iconBoxDisabled: {
    backgroundColor: '#F3F4F6',
  },
  serviceInfo: {
    flex: 1,
    marginLeft: 14,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '900',
    color: '#041614',
    marginBottom: 2,
  },
  serviceSub: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
  },
  timeHighlight: {
    color: '#39B5A8',
    fontWeight: '800',
  },
  priceInfo: {
    alignItems: 'flex-end',
  },
  priceTag: {
    fontSize: 18,
    fontWeight: '900',
    color: '#041614',
  },
  perTrip: {
    fontSize: 9,
    fontWeight: '800',
    color: '#9CA3AF',
    marginTop: 2,
  },
  textDisabled: {
    color: '#D1D5DB',
  },

  // Tags
  tagsContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    padding: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginTop: -4,
  },
  tagsScroll: {
    paddingHorizontal: 8,
    gap: 16,
  },
  tagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
  },
  tagText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#1A5D56',
    textTransform: 'uppercase',
  },

  // Bill Summary
  billSummary: {
    backgroundColor: '#F9FAFB',
    borderRadius: 24,
    padding: 20,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  billHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  billHeading: {
    fontSize: 11,
    fontWeight: '900',
    color: '#9CA3AF',
    letterSpacing: 1,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  billLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B7280',
  },
  billValue: {
    fontSize: 14,
    fontWeight: '900',
    color: '#041614',
  },
  dashedDivider: {
    height: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '900',
    color: '#041614',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#39B5A8',
  },

  transparencyBanner: {
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginTop: 0,
  },
  bannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  bannerTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#1A5D56',
  },
  bannerContent: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '700',
    marginLeft: 24,
  },
  
  hubDisplay: {
    marginTop: 8,
    backgroundColor: '#F0F9F8',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(57,181,168,0.1)',
  },
  hubHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  hubLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: '#39B5A8',
    letterSpacing: 1,
  },
  hubBody: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hubValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#041614',
  },
  hubSub: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '600',
    marginTop: 1,
  },
  changeHubBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(57,181,168,0.2)',
  },
  changeHubText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#39B5A8',
  },
  selectHubPrompt: {
    flex: 1,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#39B5A8',
  },
  selectHubPromptText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#39B5A8',
  },
});
