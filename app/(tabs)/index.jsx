import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

const LanguageDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("home");
  const [pressedCard, setPressedCard] = useState(null);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const languages = [
    { id: 1, name: "English", flag: "🇬🇧", progress: 0 },
    { id: 2, name: "Japanese", flag: "🇯🇵", progress: 0 },
    { id: 3, name: "German", flag: "🇩🇪", progress: 0 },
    { id: 4, name: "Spanish", flag: "🇪🇸", progress: 0 },
    { id: 5, name: "Arabic", flag: "🇸🇪", progress: 0 },
    { id: 6, name: "Bangla", flag: "🇧🇩", progress: 0 },
    { id: 7, name: "Mandarin", flag: "🇨🇳", progress: 0 },
    { id: 8, name: "Russian", flag: "🇷🇺", progress: 0 },
    { id: 9, name: "Hindi", flag: "🇮🇳", progress: 0 },
    { id: 10, name: "Portuguese", flag: "🇧🇷", progress: 0 },
  ];

  const filteredLanguages = languages.filter((lang) =>
    lang.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLanguageSelect = (language) => {
    if (selectedLanguages.find((lang) => lang.id === language.id)) {
      setSelectedLanguages(
        selectedLanguages.filter((lang) => lang.id !== language.id)
      );
    } else if (selectedLanguages.length < 4) {
      setSelectedLanguages([...selectedLanguages, language]);
    } else {
      alert("You can only select up to 4 languages");
    }
  };

  const renderLanguageCard = (language) => {
    const isSelected = selectedLanguages.find(
      (lang) => lang.id === language.id
    );

    return (
      <TouchableOpacity
        key={language.id}
        style={[
          styles.languageCard,
          pressedCard === language.id && styles.languageCardPressed,
          isSelected && styles.languageCardSelected,
        ]}
        onPress={() => handleLanguageSelect(language)}
        activeOpacity={0.7}
      >
        <Text style={styles.flag}>{language.flag}</Text>
        <Text style={styles.languageName}>{language.name}</Text>
        {isSelected && (
          <View style={styles.selectedIndicator}>
            <MaterialIcons name="check-circle" size={24} color="#007AFF" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const handleProfileClick = () => {
    setIsDropdownVisible((prevState) => !prevState);
  };

  return (
    <SafeAreaView
      style={[styles.container, isDarkMode && styles.darkContainer]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, isDarkMode && styles.darkText]}>
            Dashboard
          </Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.themeButton}
            onPress={() => setIsDarkMode(!isDarkMode)}
          >
            <MaterialIcons
              name={isDarkMode ? "light-mode" : "dark-mode"}
              size={24}
              color={isDarkMode ? "#fff" : "#000"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={handleProfileClick}
          >
            <Image
              source={{ uri: "https://via.placeholder.com/40" }}
              style={styles.profileImage}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Dropdown Menu */}
      {isDropdownVisible && (
        <View style={styles.dropdown}>
          <TouchableOpacity
            style={styles.dropdownItem}
            onPress={() => router.push("Profile.jsx")}
          >
            <Text style={styles.dropdownText}>View Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dropdownItem}>
            <Text style={styles.dropdownText}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dropdownItem}>
            <Text style={styles.dropdownText}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Search Bar */}
      <View
        style={[
          styles.searchContainer,
          isDarkMode && styles.darkSearchContainer,
        ]}
      >
        <MaterialIcons
          name="search"
          size={24}
          color={isDarkMode ? "#fff" : "#666"}
          style={styles.searchIcon}
        />
        <TextInput
          style={[styles.searchBar, isDarkMode && styles.darkSearchBar]}
          placeholder="Search Languages..."
          placeholderTextColor={isDarkMode ? "#999" : "#666"}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery !== "" && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <MaterialIcons
              name="close"
              size={24}
              color={isDarkMode ? "#fff" : "#666"}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Selected Languages Count */}
      <View
        style={[styles.selectionInfo, isDarkMode && styles.darkSelectionInfo]}
      >
        <Text style={[styles.selectionText, isDarkMode && styles.darkText]}>
          Selected: {selectedLanguages.length}/4 languages
        </Text>
      </View>

      {/* Language Selection */}
      <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
        Available Languages
      </Text>
      <ScrollView
        contentContainerStyle={styles.languageGrid}
        showsVerticalScrollIndicator={false}
      >
        {filteredLanguages.map(renderLanguageCard)}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  greeting: {
    fontSize: 16,
    color: "#666",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  profileButton: {
    padding: 4,
  },
  profileImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: "#007AFF",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchBar: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  languageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  languageCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  flag: {
    fontSize: 32,
    marginBottom: 8,
  },
  languageName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  languageCardPressed: {
    transform: [{ scale: 0.98 }],
    backgroundColor: "#f8f9fa",
  },
  languageCardSelected: {
    borderWidth: 2,
    borderColor: "#007AFF",
    backgroundColor: "#f8f9fa",
  },
  selectedIndicator: {
    position: "absolute",
    top: 8,
    right: 8,
  },
  selectionInfo: {
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  selectionText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    fontWeight: "600",
  },
  bottomNavContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  navButton: {
    alignItems: "center",
  },
  navText: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  activeNavText: {
    color: "#007AFF",
  },
  darkContainer: {
    backgroundColor: "#1a1a1a",
  },
  darkText: {
    color: "#fff",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  themeButton: {
    padding: 8,
    marginRight: 8,
    borderRadius: 20,
  },
  darkSearchContainer: {
    backgroundColor: "#333",
  },
  darkSearchBar: {
    color: "#fff",
  },
  darkSelectionInfo: {
    backgroundColor: "#333",
  },
  darkLanguageCard: {
    backgroundColor: "#333",
    shadowColor: "#000",
  },
  darkBottomNavContainer: {
    backgroundColor: "#1a1a1a",
    borderTopColor: "#333",
  },
  dropdown: {
    position: "absolute",
    top: 70,
    right: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  dropdownText: {
    fontSize: 16,
    color: "#333",
  },
});

export default LanguageDashboard;