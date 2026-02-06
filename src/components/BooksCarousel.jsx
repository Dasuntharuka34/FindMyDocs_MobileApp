import { Ionicons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const BooksCarousel = ({ books = [] }) => {
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / screenWidth);
    setCurrentIndex(index);
  };

  const scrollToIndex = (index) => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({ index, animated: true });
    }
  };

  const renderBookItem = ({ item, index }) => (
    <View style={styles.slide}>
      <TouchableOpacity style={styles.bookCard}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.image }}
            style={styles.bookImage}
            resizeMode="cover"
          />
          <View style={styles.overlay}>
            <Text style={styles.bookTitle}>{item.title}</Text>
            <Text style={styles.bookAuthor}>{item.author}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderPagination = () => {
    return (
      <View style={styles.pagination}>
        {books.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.paginationDot,
              index === currentIndex && styles.paginationDotActive,
            ]}
            onPress={() => scrollToIndex(index)}
          />
        ))}
      </View>
    );
  };

  if (!books || books.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No books available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Featured Books</Text>
        <TouchableOpacity style={styles.seeAllButton}>
          <Text style={styles.seeAllText}>See All</Text>
          <Ionicons name="chevron-forward" size={16} color="#007bff" />
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={books}
        renderItem={renderBookItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.carousel}
      />

      {renderPagination()}

      {/* Navigation Buttons */}
      <TouchableOpacity
        style={[styles.navButton, styles.navButtonLeft]}
        onPress={() => {
          const newIndex = Math.max(0, currentIndex - 1);
          scrollToIndex(newIndex);
        }}
        disabled={currentIndex === 0}
      >
        <Ionicons
          name="chevron-back"
          size={24}
          color={currentIndex === 0 ? '#ccc' : '#333'}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.navButton, styles.navButtonRight]}
        onPress={() => {
          const newIndex = Math.min(books.length - 1, currentIndex + 1);
          scrollToIndex(newIndex);
        }}
        disabled={currentIndex === books.length - 1}
      >
        <Ionicons
          name="chevron-forward"
          size={24}
          color={currentIndex === books.length - 1 ? '#ccc' : '#333'}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 14,
    color: '#007bff',
    marginRight: 5,
  },
  carousel: {
    height: 300,
  },
  slide: {
    width: screenWidth,
    paddingHorizontal: 20,
  },
  bookCard: {
    flex: 1,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  imageContainer: {
    flex: 1,
    position: 'relative',
  },
  bookImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 20,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  bookAuthor: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ddd',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#007bff',
    width: 20,
  },
  navButton: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -12 }],
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  navButtonLeft: {
    left: 10,
  },
  navButtonRight: {
    right: 10,
  },
  emptyContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});

export default BooksCarousel;
