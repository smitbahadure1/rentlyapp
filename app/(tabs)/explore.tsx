import { View, Text, StyleSheet, Dimensions, TextInput, TouchableOpacity, ScrollView, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import { useState, useEffect } from 'react';
import { getPopularCars, searchCarsByBrand, type CarData } from '@/services/carApi';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { storeCarData } from '@/services/carDataStore';

const { width } = Dimensions.get('window');

// Mock Data
const POPULAR_SEARCHES = ['SUV', 'Electric', 'Luxury', '7 Seater', 'Under $50k'];


import { fetchCars } from '@/services/supabaseService';

export default function ExploreScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ q?: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sync search query from URL params
  useEffect(() => {
    if (params.q) {
      setSearchQuery(params.q);
    }
  }, [params.q]);

  useEffect(() => {
    async function loadExploreData() {
      try {
        setLoading(true);
        // Fetch from both sources for maximum variety
        const [supabaseCars, apiCars] = await Promise.all([
          fetchCars(),
          getPopularCars(80)
        ]);

        const combined = [...(supabaseCars || []), ...(apiCars || [])];
        setCars(combined);
      } catch (err) {
        console.error('Error fetching cars:', err);
        setError('Failed to load cars');
      } finally {
        setLoading(false);
      }
    }

    loadExploreData();
  }, []);

  // Filter cars based on search query
  const filteredCars = searchQuery
    ? cars.filter(car =>
      `${car.brand} ${car.model}`.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : cars;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header / Search */}
      <SafeAreaView style={styles.headerContainer} edges={['top', 'left', 'right']}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput
            placeholder="Search cars, brands..."
            style={styles.input}
            placeholderTextColor="#6B7280"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#6B7280" />
            </TouchableOpacity>
          ) : null}
        </View>
        <TouchableOpacity style={styles.filterBtn}>
          <Ionicons name="options" size={20} color="#000" />
        </TouchableOpacity>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Map Placeholder */}
        <View style={styles.mapPreview}>
          <View style={styles.mapOverlay}>
            <Ionicons name="map" size={32} color="#4B5563" />
            <Text style={styles.mapText}>View on Map</Text>
          </View>
          {/* In a real app, this would be a MapView or an Image of a map */}
        </View>

        {/* Popular Tags */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Searches</Text>
          <View style={styles.tagsRow}>
            {POPULAR_SEARCHES.map((tag, index) => (
              <TouchableOpacity key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Results List - Premium Feed */}
        <View style={[styles.section, { paddingBottom: 100 }]}>
          <Text style={styles.sectionTitle}>
            {searchQuery ? `Results for "${searchQuery}"` : 'Explore Nearby'}
          </Text>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#EF4444" />
              <Text style={styles.loadingText}>Loading cars...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={() => {
                setLoading(true);
                setError(null);
                getPopularCars(20).then(setCars).catch(() => setError('Failed to load cars')).finally(() => setLoading(false));
              }}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : filteredCars.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="car-outline" size={64} color="#4B5563" />
              <Text style={styles.emptyText}>No cars found</Text>
              <Text style={styles.emptySubtext}>Try adjusting your search</Text>
            </View>
          ) : (
            filteredCars.map((car) => (
              <TouchableOpacity
                key={car.id}
                style={styles.feedCard}
                activeOpacity={0.9}
                onPress={() => {
                  storeCarData(car.id, car);
                  router.push(`/car/${car.id}`);
                }}
              >
                <View style={styles.feedImageContainer}>
                  <Image source={{ uri: car.image }} style={styles.feedImage} contentFit="cover" />
                  <View style={styles.feedBadge}>
                    <Ionicons name="navigate-circle" size={14} color="#FFF" />
                    <Text style={styles.feedBadgeText}>{(Math.random() * 10 + 1).toFixed(1)} km</Text>
                  </View>
                  <TouchableOpacity style={styles.likeButton}>
                    <Ionicons name="heart-outline" size={20} color="#FFF" />
                  </TouchableOpacity>
                </View>

                <View style={styles.feedInfo}>
                  <View style={styles.feedHeader}>
                    <Text style={styles.feedTitle}>{car.brand} {car.model}</Text>
                    <View style={styles.ratingTag}>
                      <Ionicons name="star" size={12} color="#000" />
                      <Text style={styles.ratingNum}>{car.rating?.toFixed(1) || '4.5'}</Text>
                    </View>
                  </View>

                  <Text style={styles.feedSubtitle}>
                    {Math.floor(Math.random() * 200 + 50)} trips • {car.transmission} • {car.seats} Seats
                  </Text>

                  <View style={styles.feedFooter}>
                    <View>
                      <Text style={styles.feedPrice}>₹{car.price}k<Text style={styles.feedPriceUnit}>/day</Text></Text>
                      <Text style={styles.feedTotal}>₹{(car.price || 0) * 4}k est. total</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.bookBtn}
                      onPress={() => {
                        storeCarData(car.id, car);
                        router.push(`/checkout/${car.id}`);
                      }}
                    >
                      <Text style={styles.bookBtnText}>Book Now</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  headerContainer: {
    backgroundColor: '#000000',
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 10,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    height: 50,
    backgroundColor: '#1C1C1E',
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  input: {
    flex: 1,
    marginLeft: 10,
    color: '#FFF',
    fontSize: 15,
  },
  filterBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  mapPreview: {
    width: '100%',
    height: 120,
    backgroundColor: '#1C1C1E',
    borderRadius: 20,
    marginBottom: 24,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  mapOverlay: {
    alignItems: 'center',
  },
  mapText: {
    color: '#9CA3AF',
    marginTop: 8,
    fontFamily: 'Inter_600SemiBold',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter_800ExtraBold',
    color: '#FFF',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1C1C1E',
    borderWidth: 1,
    borderColor: '#333',
  },
  tagText: {
    color: '#D1D5DB',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  /* Feed Card Styles */
  feedCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 24,
    marginBottom: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333',
  },
  feedImageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#27272A',
    position: 'relative',
  },
  feedImage: {
    width: '100%',
    height: '100%',
  },
  feedBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  feedBadgeText: {
    color: '#FFF',
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  likeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  feedInfo: {
    padding: 16,
  },
  feedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  feedTitle: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: '#FFF',
    flex: 1,
    marginRight: 10,
  },
  ratingTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  ratingNum: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    color: '#000',
  },
  feedSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 16,
  },
  feedFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingTop: 16,
  },
  feedPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
  },
  feedPriceUnit: {
    fontSize: 14,
    fontWeight: '400',
    color: '#9CA3AF',
  },
  feedTotal: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  bookBtn: {
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  bookBtnText: {
    color: '#000',
    fontWeight: '700',
    fontSize: 14,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#9CA3AF',
    marginTop: 16,
    fontSize: 14,
  },
  errorContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: '#EF4444',
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: '#EF4444',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  retryButtonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },
  emptyContainer: {
    padding: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#9CA3AF',
    marginTop: 16,
    fontSize: 18,
    fontWeight: '700',
  },
  emptySubtext: {
    color: '#6B7280',
    marginTop: 8,
    fontSize: 14,
  },
});
