import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

const CATEGORIES = [
  { id: '1', name: 'Economy', image: require('@/assets/images/cat_economy.png') },
  { id: '2', name: 'SUV', image: require('@/assets/images/cat_suv.png') },
  { id: '3', name: 'Van', image: require('@/assets/images/cat_van.png') },
  { id: '4', name: 'Luxury', image: require('@/assets/images/cat_luxury.png') },
];

const RECOMMENDATIONS = [
  {
    id: '1',
    name: 'BMW 5 Series',
    image: require('@/assets/images/rec_bmw_5.png'),
    specs: 'Auto • 5 Seats',
    rating: '5.0',
    reviews: '(23)',
    price: 'N250k',
    unit: '/day'
  },
  {
    id: '2',
    name: 'BMW X4 M',
    image: require('@/assets/images/rec_bmw_x4.png'),
    specs: 'Auto • 5 Seats',
    rating: '5.0',
    reviews: '(12)',
    price: 'N250k',
    unit: '/day'
  },
];

export default function HomeScreen() {
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
              <Text style={styles.locationText}>Lagos, Nigeria</Text>
              <Ionicons name="chevron-down" size={12} color="#9CA3AF" style={{ marginLeft: 2 }} />
            </View>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            {/* Placeholder for user avatar or icon */}
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

          <View style={styles.searchContainer}>
            <View style={styles.searchInputRow}>
              <Ionicons name="search" size={20} color="#9CA3AF" />
              <TextInput
                placeholder="Search e.g. Toyota, BMW..."
                style={styles.searchInput}
                placeholderTextColor="#6B7280"
              />
            </View>
            <TouchableOpacity style={styles.filterButton}>
              <Ionicons name="options-outline" size={20} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Categories - Chip Style */}
        <View style={styles.section}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
            <TouchableOpacity style={[styles.categoryChip, styles.activeCategoryChip]}>
              <Text style={[styles.categoryText, styles.activeCategoryText]}>All</Text>
            </TouchableOpacity>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity key={cat.id} style={styles.categoryChip}>
                <Text style={styles.categoryText}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Offer / Wallet Banner (Sleek) */}
        <View style={styles.bannerContainer}>
          <View style={styles.walletBanner}>
            <View>
              <Text style={styles.walletLabel}>Wallet Balance</Text>
              <Text style={styles.walletBalance}>N 145,000.00</Text>
            </View>
            <TouchableOpacity style={styles.topUpButtonSmall}>
              <Text style={styles.topUpTextSmall}>+ Top Up</Text>
            </TouchableOpacity>
            {/* Decorative Circle */}
            <View style={styles.decorativeCircle} />
          </View>
        </View>

        {/* Popular Cars Feed (Redesigned) */}
        <View style={[styles.section, { paddingBottom: 100 }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Cars</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.feedContainer}>
            {RECOMMENDATIONS.map((car) => (
              <TouchableOpacity key={car.id} style={styles.feedCard} activeOpacity={0.9}>
                <View style={styles.feedImageContainer}>
                  <Image source={car.image} style={styles.feedImage} contentFit="cover" />
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
                    <Text style={styles.feedTitle}>{car.name}</Text>
                    <View style={styles.ratingTag}>
                      <Ionicons name="star" size={12} color="#000" />
                      <Text style={styles.ratingNum}>{car.rating}</Text>
                    </View>
                  </View>

                  <Text style={styles.feedSubtitle}>{car.reviews} Reviews • {car.specs}</Text>

                  <View style={styles.feedFooter}>
                    <View>
                      <Text style={styles.feedPrice}>{car.price}<Text style={styles.feedPriceUnit}>/day</Text></Text>
                      <Text style={styles.feedTotal}>Free cancellation</Text>
                    </View>
                    <TouchableOpacity style={styles.bookBtn}>
                      <Text style={styles.bookBtnText}>Book Now</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

      </ScrollView>
    </View>
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
  walletBanner: {
    backgroundColor: '#1C1C1E',
    borderRadius: 24,
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#27272A',
  },
  walletLabel: {
    color: '#9CA3AF',
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    marginBottom: 4,
  },
  walletBalance: {
    color: '#FFFFFF',
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
  },
  topUpButtonSmall: {
    backgroundColor: '#333',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    zIndex: 10,
    borderWidth: 1,
    borderColor: '#444',
  },
  topUpTextSmall: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  decorativeCircle: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.03)',
    right: -20,
    top: -30,
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
});
