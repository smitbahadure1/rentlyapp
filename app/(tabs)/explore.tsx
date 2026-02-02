import { View, Text, StyleSheet, Dimensions, TextInput, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import { useState } from 'react';

const { width } = Dimensions.get('window');

// Mock Data
const POPULAR_SEARCHES = ['SUV', 'Electric', 'Luxury', '7 Seater', 'Under $50k'];

const EXPLORE_CARS = [
  { id: '1', name: 'Mercedes-Benz C-Class', image: require('@/assets/images/rec_bmw_5.png'), rating: '4.8', trips: '120 trips', price: 'N300k', distance: '2.5 km' },
  { id: '2', name: 'Tesla Model 3', image: require('@/assets/images/rec_bmw_x4.png'), rating: '5.0', trips: '45 trips', price: 'N450k', distance: '5.0 km' },
  { id: '3', name: 'Range Rover Sport', image: require('@/assets/images/rec_bmw_5.png'), rating: '4.9', trips: '80 trips', price: 'N600k', distance: '12 km' },
  { id: '4', name: 'Toyota Camry', image: require('@/assets/images/rec_bmw_x4.png'), rating: '4.7', trips: '200+ trips', price: 'N150k', distance: '1.2 km' },
];

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState('');

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
          <Text style={styles.sectionTitle}>Explore Nearby</Text>
          {EXPLORE_CARS.map((car) => (
            <TouchableOpacity key={car.id} style={styles.feedCard} activeOpacity={0.9}>
              <View style={styles.feedImageContainer}>
                <Image source={car.image} style={styles.feedImage} contentFit="cover" />
                <View style={styles.feedBadge}>
                  <Ionicons name="navigate-circle" size={14} color="#FFF" />
                  <Text style={styles.feedBadgeText}>{car.distance}</Text>
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

                <Text style={styles.feedSubtitle}>{car.trips} • Automatic • 5 Seats</Text>

                <View style={styles.feedFooter}>
                  <View>
                    <Text style={styles.feedPrice}>{car.price}<Text style={styles.feedPriceUnit}>/day</Text></Text>
                    <Text style={styles.feedTotal}>N120,000 est. total</Text>
                  </View>
                  <TouchableOpacity style={styles.bookBtn}>
                    <Text style={styles.bookBtnText}>Book Now</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
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
});
