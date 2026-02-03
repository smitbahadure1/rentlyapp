import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Dimensions, Platform, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { getPopularCars, type CarData } from '@/services/carApi';
import { useRouter } from 'expo-router';
import { storeCarData } from '@/services/carDataStore';



const EXPERIENCES = [
  { id: 'e1', title: 'The Coastal Run', location: 'Mumbai to Goa', fleet: 'Porsche 911', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80' },
  { id: 'e2', title: 'Mountain Elite', location: 'Lonavala Valley', fleet: 'Range Rover', image: 'https://images.unsplash.com/photo-1524146127334-df98a9fd517e?w=800&q=80' },
  { id: 'e3', title: 'Heritage Drive', location: 'Jaipur Circuit', fleet: 'Vintage Rolls', image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80' },
];

import { fetchCars } from '@/services/supabaseService';

export default function HomeScreen() {
  const router = useRouter();
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        // Fetch from both sources to create a massive feed
        const [supabaseCars, apiCars] = await Promise.all([
          fetchCars().catch(err => {
            console.warn('Supabase cars fetch failed, using API only:', err);
            return [];
          }),
          getPopularCars(80)
        ]);

        console.log(`📊 Loaded ${supabaseCars?.length || 0} cars from Supabase`);
        console.log(`📊 Loaded ${apiCars?.length || 0} cars from API`);

        // Prioritize Supabase cars but append API cars for high density
        const combinedCars = [...(supabaseCars || []), ...(apiCars || [])];
        console.log(`✅ Total cars to display: ${combinedCars.length}`);
        setCars(combinedCars);
      } catch (err) {
        console.error('Error fetching cars:', err);
        setError('Failed to load cars');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header / Top Bar in SafeArea */}
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <View style={styles.locationContainer}>
            <Text style={styles.locationLabel}>Your location</Text>
            <View style={styles.locationRow}>
              <Ionicons name="location" size={16} color="#EF4444" />
              <Text style={styles.locationText}>Mumbai, India</Text>
              <Ionicons name="chevron-down" size={12} color="#9CA3AF" style={{ marginLeft: 2 }} />
            </View>
          </View>
          <TouchableOpacity style={styles.profileButton} onPress={() => router.push('/(tabs)/account')}>
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={16} color="#000" />
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Search / Hero Card */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Find the perfect car{'\n'}for your trip.</Text>

          <View style={styles.searchInputRow}>
            <Ionicons name="search" size={20} color="#9CA3AF" />
            <TextInput
              placeholder="Search e.g. Toyota, BMW..."
              style={styles.searchInput}
              placeholderTextColor="#6B7280"
            />
          </View>
        </View>

        {/* Membership / Rewards Banner (Premium) */}
        <View style={styles.bannerContainer}>
          <TouchableOpacity
            style={styles.membershipBanner}
            onPress={() => router.push('/(tabs)/account' as any)}
            activeOpacity={0.9}
          >
            <View>
              <Text style={styles.membershipLabel}>MEMBERSHIP STATUS</Text>
              <View style={styles.tierRow}>
                <Ionicons name="diamond" size={20} color="#FFF" />
                <Text style={styles.membershipTier}>BLACK TIER</Text>
              </View>
            </View>
            <View style={styles.pointsBadge}>
              <Text style={styles.pointsValue}>2,450</Text>
              <Text style={styles.pointsLabel}>PTS</Text>
            </View>
            {/* Holographic Pattern Placeholder */}
            <View style={styles.holographicOverlay} />
          </TouchableOpacity>
        </View>

        {/* Elite Experiences (Curated Trips) */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Elite Experiences</Text>
            <View style={styles.badgeTier}>
              <Ionicons name="diamond" size={10} color="#000" />
              <Text style={styles.badgeTierText}>BLACK TIER</Text>
            </View>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.expScroll}>
            {EXPERIENCES.map((exp) => (
              <TouchableOpacity
                key={exp.id}
                activeOpacity={0.9}
                style={styles.expCard}
                onPress={() => {
                  // Try to find a matching car in our already loaded list
                  const matchingCar = cars.find(c =>
                    c.brand.toLowerCase().includes(exp.fleet.split(' ')[0].toLowerCase()) ||
                    c.model.toLowerCase().includes(exp.fleet.split(' ')[0].toLowerCase())
                  );

                  if (matchingCar) {
                    storeCarData(matchingCar.id, matchingCar);
                    router.push(`/car/${matchingCar.id}` as any);
                  } else {
                    // Fallback to explore search if not in popular list
                    router.push({
                      pathname: '/(tabs)/explore',
                      params: { q: exp.fleet.split(' ')[0] }
                    } as any);
                  }
                }}
              >
                <Image source={{ uri: exp.image }} style={styles.expImage} contentFit="cover" />
                <View style={styles.expOverlay}>
                  <Text style={styles.expLocation}>{exp.location}</Text>
                  <Text style={styles.expTitle}>{exp.title}</Text>
                  <View style={styles.expFleetRow}>
                    <Ionicons name="car-sport" size={12} color="#FFF" />
                    <Text style={styles.expFleet}>{exp.fleet} Included</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Popular Cars Feed (Redesigned) */}
        <View style={[styles.section, { paddingBottom: 100 }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Cars</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#EF4444" />
              <Text style={styles.loadingText}>Loading cars from API...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={() => {
                setLoading(true);
                setError(null);
                fetchCars().then(setCars).catch(() => setError('Failed to load cars')).finally(() => setLoading(false));
              }}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.feedContainer}>
              {cars.map((car) => (
                <TouchableOpacity
                  key={car.id}
                  style={styles.feedCard}
                  activeOpacity={0.9}
                  onPress={() => {
                    storeCarData(car.id, car);
                    router.push(`/car/${car.id}` as any);
                  }}
                >
                  <View style={styles.feedImageContainer}>
                    <Image source={{ uri: car.image }} style={styles.feedImage} contentFit="cover" />
                    <View style={styles.feedBadge}>
                      <Ionicons name="flash" size={12} color="#FFF" />
                      <Text style={styles.feedBadgeText}>Popular</Text>
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

                    <Text style={styles.feedSubtitle}>{car.transmission} • {car.seats} Seats • {car.fuelType || car.fuel_type}</Text>

                    <View style={styles.feedFooter}>
                      <View>
                        <Text style={styles.feedPrice}>₹ {car.price}k<Text style={styles.feedPriceUnit}>/day</Text></Text>
                        <Text style={styles.feedTotal}>Free cancellation</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.bookBtn}
                        onPress={() => {
                          storeCarData(car.id, car);
                          router.push(`/car/${car.id}` as any);
                        }}
                      >
                        <Text style={styles.bookBtnText}>Book Now</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

      </ScrollView >
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Deep Black
  },
  safeArea: {
    backgroundColor: '#000000',
    paddingBottom: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    marginBottom: 4,
  },
  locationContainer: {
    justifyContent: 'center',
  },
  locationLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1C1C1E', // Dark Grey
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF', // White avatar container for contrast
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingTop: 10,
  },
  heroSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  heroTitle: {
    fontSize: 28,
    fontFamily: 'Inter_800ExtraBold',
    color: '#FFFFFF',
    lineHeight: 36,
    marginBottom: 20,
    letterSpacing: -0.5,
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  searchInputRow: {
    flex: 1,
    height: 52,
    backgroundColor: '#1C1C1E', // Dark card
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: '#FFFFFF',
    fontFamily: 'Inter_500Medium',
  },
  filterButton: {
    width: 52,
    height: 52,
    backgroundColor: '#FFFFFF', // High contrast white button
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: 24,
  },
  categoriesScroll: {
    paddingHorizontal: 20,
    gap: 10,
  },
  categoryChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#1C1C1E',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  activeCategoryChip: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: '#D1D5DB',
  },
  activeCategoryText: {
    color: '#000000',
  },
  bannerContainer: {
    paddingHorizontal: 20,
    marginBottom: 28,
  },
  membershipBanner: {
    backgroundColor: '#1E1E1E',
    borderRadius: 24,
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#333',
  },
  membershipLabel: {
    color: '#9CA3AF',
    fontSize: 10,
    fontFamily: 'Inter_800ExtraBold',
    letterSpacing: 1,
    marginBottom: 8,
  },
  tierRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  membershipTier: {
    color: '#FFFFFF',
    fontSize: 24,
    fontFamily: 'Inter_900Black',
    letterSpacing: -0.5,
  },
  pointsBadge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  pointsValue: {
    color: '#000',
    fontSize: 18,
    fontFamily: 'Inter_800ExtraBold',
  },
  pointsLabel: {
    color: '#000',
    fontSize: 8,
    fontFamily: 'Inter_900Black',
    marginTop: -2,
  },
  holographicOverlay: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255,255,255,0.02)',
    right: -40,
    top: -50,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: '#6B7280',
  },
  badgeTier: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeTierText: {
    color: '#000',
    fontSize: 8,
    fontFamily: 'Inter_900Black',
    letterSpacing: 0.5,
  },
  expScroll: {
    paddingHorizontal: 20,
    gap: 16,
  },
  expCard: {
    width: 280,
    height: 180,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#1C1C1E',
    borderWidth: 1,
    borderColor: '#333',
  },
  expImage: {
    width: '100%',
    height: '100%',
  },
  expOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 16,
    justifyContent: 'flex-end',
  },
  expLocation: {
    color: '#FFF',
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    opacity: 0.8,
  },
  expTitle: {
    color: '#FFF',
    fontSize: 20,
    fontFamily: 'Inter_800ExtraBold',
    marginBottom: 4,
  },
  expFleetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    opacity: 0.9,
  },
  expFleet: {
    color: '#FFF',
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
  },
  feedContainer: {
    paddingHorizontal: 20,
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
    marginLeft: 4,
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
    fontFamily: 'Inter_700Bold',
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
});
